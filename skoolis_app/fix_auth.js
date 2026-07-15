const fs = require('fs');
const path = require('path');

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

const authHelperCode = `
// Ajout auto : helper d'entête d'authentification Bearer
const getAuthHeaders = (existingHeaders = {}) => {
    if (typeof window === 'undefined') return existingHeaders;
    const token = localStorage.getItem('skoolis_token');
    return token ? { ...existingHeaders, 'Authorization': \`Bearer \${token}\` } : existingHeaders;
};
`;

walk('c:/Users/Sokka04/OneDrive/Desktop/skoolis_real/skoolis_app/app/dashboard', function(err, results) {
  if (err) throw err;
  
  let modifiedFiles = 0;
  
  results.filter(f => f.endsWith('.tsx')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Inject auth helper if it has fetch
    if (content.includes('fetch(') && !content.includes('getAuthHeaders')) {
        // Insert after imports
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLine = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLine + 1) + authHelperCode + content.slice(endOfLine + 1);
        } else {
            content = authHelperCode + content;
        }
    }

    // Replace headers in fetch calls
    // It's a bit tricky with regex, let's target the exact patterns we saw:
    // { headers: { 'Accept': 'application/json' }, credentials: 'include' }
    // { credentials: 'include' }
    
    content = content.replace(/\{ headers:\s*\{\s*'Accept':\s*'application\/json'\s*\},?\s*credentials:\s*'include'\s*\}/g, 
      "{ headers: getAuthHeaders({ 'Accept': 'application/json' }) }");
      
    content = content.replace(/\{\s*credentials:\s*'include'\s*\}/g, 
      "{ headers: getAuthHeaders() }");

    // Also catch fetch(`${API_BASE_URL}...`, { ... }) where headers might be defined differently
    // Actually, just searching for `credentials: 'include'` and replacing it with spreading the auth headers could be enough?
    // Let's replace any `credentials: 'include'` that we missed
    content = content.replace(/credentials:\s*'include'/g, "/* credentials removed */");

    if (content !== original) {
      fs.writeFileSync(file, content);
      modifiedFiles++;
      console.log('Modifié:', file);
    }
  });
  
  console.log("Terminé. " + modifiedFiles + " fichiers modifiés.");
});
