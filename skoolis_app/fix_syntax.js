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

walk('c:/Users/Sokka04/OneDrive/Desktop/skoolis_real/skoolis_app/app/dashboard', function(err, results) {
  if (err) throw err;
  
  let modifiedFiles = 0;
  
  results.filter(f => f.endsWith('.tsx')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Nettoyer les commentaires problématiques qui causent des erreurs de syntaxe
    // Ex: /* credentials removed */, ou , /* credentials removed */
    content = content.replace(/\/\*\s*credentials removed\s*\*\/\s*,/g, "");
    content = content.replace(/,\s*\/\*\s*credentials removed\s*\*\//g, "");
    content = content.replace(/\/\*\s*credentials removed\s*\*\//g, "");
    
    // On peut avoir des virgules orphelines comme: { headers: {...}, , body: ... }
    content = content.replace(/,\s*,/g, ",");
    // Ou une virgule suivie d'accolade fermante (valide en JS mais on nettoie)
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      modifiedFiles++;
      console.log('Modifié:', file);
    }
  });
  
  console.log("Terminé. " + modifiedFiles + " fichiers nettoyés.");
});
