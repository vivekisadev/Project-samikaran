const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/sections/StackedCardCarousel.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix escaped backticks from the markdown block
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed backslashes');
