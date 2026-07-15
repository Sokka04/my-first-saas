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
    
    // Remplacer : headers: { 'Accept': 'application/json' } par headers: getAuthHeaders({ 'Accept': 'application/json' })
    content = content.replace(/headers:\s*\{\s*'Accept':\s*'application\/json'\s*\}/g, "headers: getAuthHeaders({ 'Accept': 'application/json' })");
    
    // Remplacer : { headers: getAuthHeaders(...) } si jamais il n'y avait que credentials avant (qui est maintenant /* credentials removed */)
    // En fait, certains ont :
    // fetch(URL, {
    //    method: 'POST',
    //    headers: { ... },
    // })
    // On peut chercher tous les "headers: {" qui ne sont pas déjà wrappés par getAuthHeaders
    
    // Une approche plus sûre pour tous les autres headers non wrappés :
    content = content.replace(/headers:\s*\{([^}]+)\}/g, (match, inner) => {
        if (inner.includes("'Accept': 'application/json'")) {
            return `headers: getAuthHeaders({${inner}})`;
        }
        if (inner.includes("'Content-Type'")) {
            return `headers: getAuthHeaders({${inner}})`;
        }
        return match; // fallback
    });
    
    // Si la requête n'avait PAS de header mais juste credentials (qui a été retiré), il faut ajouter headers
    content = content.replace(/\{\s*\/\*\s*credentials removed\s*\*\/\s*\}/g, "{ headers: getAuthHeaders() }");

    if (content !== original) {
      fs.writeFileSync(file, content);
      modifiedFiles++;
      console.log('Modifié 2ème passe:', file);
    }
  });
  
  console.log("Terminé. " + modifiedFiles + " fichiers modifiés (2ème passe).");
});
