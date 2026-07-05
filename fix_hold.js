const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/sections/StackedCardCarousel.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. In Card, get isLast from props instead of computing it
content = content.replace(/const Card = \(\{ item, index, progress, total \}\) => \{/, 'const Card = ({ item, index, progress, total, isLast }) => {');
content = content.replace(/\s*\/\/ Is this the very last card\?\s*const isLast = index === total - 1;/g, '');

// 2. Set height to (items.length + 1) * 100vh
content = content.replace(/style=\{\{ height: \`\$\{\(items\.length \+ 0\.5\) \* 100\}vh\` \}\}/g, 'style={{ height: `${(items.length + 1) * 100}vh` }}');

// 3. Update Card props
content = content.replace(/total=\{items\.length\}/g, 'total={items.length + 1}\n              isLast={index === items.length - 1}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed extra scroll time for last card');
