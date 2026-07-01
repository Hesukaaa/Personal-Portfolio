const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');
const srcFile = path.join(distDir, 'index.html');
const destFile = path.join(distDir, '404.html');

fs.copyFileSync(srcFile, destFile);
console.log('Created 404.html fallback for SPA routing');
