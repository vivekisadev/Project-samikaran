const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/Home.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import StackedCardCarousel
content = content.replace(
  /import DepthBlurCarousel from '\.\.\/components\/sections\/DepthBlurCarousel';/,
  "import DepthBlurCarousel from '../components/sections/DepthBlurCarousel';\nimport StackedCardCarousel from '../components/sections/StackedCardCarousel';"
);

// 2. Replace the "Our Playbook" section
const startIndex = content.indexOf('{/* Moments Carousel Section — Premium 3D Depth-Blur */}');
const endIndex = content.indexOf('{/* Playbook Event Modal */}');

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{/* Moments Carousel Section — Stacked Card Parallax */}
      <StackedCardCarousel items={mediaItems} onImageClick={(item, idx) => openModal(mediaItems[idx])} />\n\n      `;
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Home.jsx updated successfully.');
} else {
  console.log('Failed to find section boundaries.');
}
