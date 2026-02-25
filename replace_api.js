const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const libDir = path.join(__dirname, 'lib');

const DIRS_TO_SCAN = [srcDir, libDir];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('https://qnect.in/api')) {
        content = content.replace(/https:\/\/qnect\.in\/api/g, 'https://qnect-backend-app-zne7q.ondigitalocean.app/api');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            replaceInFile(fullPath);
        }
    }
}

DIRS_TO_SCAN.forEach(scanDirectory);
console.log('Done scanning.');
