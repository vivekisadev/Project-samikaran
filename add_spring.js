const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/sections/StackedCardCarousel.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import useSpring
content = content.replace(
  /import \{ motion, useScroll, useTransform \} from 'framer-motion';/,
  "import { motion, useScroll, useTransform, useSpring } from 'framer-motion';"
);

// 2. Add useSpring hook in StackedCardCarousel
const hookLocation = content.indexOf('const { scrollYProgress } = useScroll(');
if (hookLocation !== -1) {
  const hookEnd = content.indexOf('});', hookLocation) + 3;
  const newHook = `
  // Add a spring physics layer over the raw scroll progress for buttery smooth interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001
  });
`;
  content = content.substring(0, hookEnd) + newHook + content.substring(hookEnd);
  
  // 3. Replace progress={scrollYProgress} with progress={smoothProgress}
  content = content.replace(/progress=\{scrollYProgress\}/g, 'progress={smoothProgress}');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Added useSpring for ultra-smooth animations');
} else {
  console.log('Could not find useScroll hook');
}
