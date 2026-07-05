const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/admin/AdminApp.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace overly bold and brutalist typography classes with cleaner, professional ones
const replacements = [
  // Huge titles
  { regex: /text-4xl md:text-6xl font-black text-gray-900 tracking-tighter break-words/g, replacement: 'text-3xl md:text-4xl font-bold text-gray-900' },
  { regex: /text-4xl font-black text-gray-900 tracking-tighter uppercase/g, replacement: 'text-2xl font-bold text-gray-900' },
  { regex: /text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2/g, replacement: 'text-2xl font-bold text-gray-900 mb-2' },
  { regex: /text-5xl font-black text-gray-900 tracking-tighter/g, replacement: 'text-4xl font-bold text-gray-900' },
  { regex: /text-3xl font-black text-gray-900 tracking-tight/g, replacement: 'text-2xl font-bold text-gray-900' },
  
  // Subtitles (the small uppercase spaced-out ones)
  { regex: /text-gray-400 font-black text-\[10px\] uppercase tracking-\[0\.3em\] mt-2/g, replacement: 'text-gray-500 font-medium text-sm mt-1' },
  { regex: /text-\[10px\] font-black text-gray-400 uppercase tracking-\[0\.3em\] mb-10/g, replacement: 'text-gray-500 font-medium text-sm mb-10' },
  { regex: /text-\[10px\] font-black text-gray-400 uppercase tracking-widest mt-1/g, replacement: 'text-gray-500 font-medium text-xs mt-1' },
  { regex: /text-\[10px\] font-black text-gray-400 uppercase tracking-\[0\.2em\]/g, replacement: 'text-gray-500 font-medium text-sm' },
  { regex: /text-\[10px\] font-black text-gray-400 uppercase tracking-widest px-4/g, replacement: 'text-xs font-semibold text-gray-500 px-4' },
  
  // Form labels
  { regex: /text-xs font-black text-gray-400 uppercase tracking-\[0\.15em\] ml-1/g, replacement: 'text-sm font-medium text-gray-700 ml-1 mb-1 block' },
  { regex: /text-xs font-black text-gray-500 uppercase/g, replacement: 'text-sm font-medium text-gray-700 block mb-1' },
  { regex: /text-xs font-bold text-gray-500 uppercase/g, replacement: 'text-sm font-medium text-gray-700 block mb-1' },

  // General font-black removal
  { regex: /font-black/g, replacement: 'font-semibold' },
  
  // Clean up input fields that might have weird tracking
  { regex: /font-black text-xs tracking-widest text-gray-800 transition-all uppercase/g, replacement: 'font-medium text-sm text-gray-800 transition-all' }
];

replacements.forEach(r => {
  content = content.replace(r.regex, r.replacement);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Typography updated in AdminApp.jsx');
