const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/admin/AdminApp.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const updatedContent = content.replace(/catch\s*\{/g, 'catch (err) {');

if (content !== updatedContent) {
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('Fixed optional catch binding');
} else {
  console.log('No optional catch bindings found');
}
