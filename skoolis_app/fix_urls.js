const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const dir = path.join(__dirname, 'app');

walkDir(dir, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Replace hardcoded API_BASE_URL
        if (content.match(/const API_BASE_URL = 'http:\/\/(127\.0\.0\.1|localhost):8000\/api\/v1';/)) {
            content = content.replace(/const API_BASE_URL = 'http:\/\/(127\.0\.0\.1|localhost):8000\/api\/v1';/g, "const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';");
            modified = true;
        }

        // Replace hardcoded image storage URLs
        if (content.match(/http:\/\/(127\.0\.0\.1|localhost):8000\/storage\//)) {
            content = content.replace(/http:\/\/(127\.0\.0\.1|localhost):8000\/storage\//g, "${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000'}/storage/");
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Updated: " + filePath);
        }
    }
});
