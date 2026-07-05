const fs = require('fs');
const path = require('path');

const heroPath = path.join(__dirname, 'frontend/src/components/sections/HeroSection.jsx');
let heroContent = fs.readFileSync(heroPath, 'utf8');
heroContent = heroContent.replace(/#FF7A59/g, '#18483B');
heroContent = heroContent.replace(/#ff643d/g, '#0f2d25'); // hover state for the dark green
fs.writeFileSync(heroPath, heroContent, 'utf8');

const impactPath = path.join(__dirname, 'frontend/src/components/sections/ImpactStats.jsx');
let impactContent = fs.readFileSync(impactPath, 'utf8');
impactContent = impactContent.replace(/#FF7A59/g, '#18483B');
fs.writeFileSync(impactPath, impactContent, 'utf8');

console.log('Colors replaced successfully');
