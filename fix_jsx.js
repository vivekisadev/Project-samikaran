const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/admin/AdminApp.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The replacement issue caused titles like:
// title={"{editingId ? 'Edit Image' : 'Add Image'}"}
// or title={"{editingId ? "Edit Image" : "Add Image"}"}
// We want to extract the inner { ... } and use it directly.

content = content.replace(/title=\{"(\{.*?\})\"\}/g, 'title=$1');
content = content.replace(/title=\{"\{([^}]+)\}\"\}/g, 'title={$1}');
// Explicit fixes
content = content.replace(/title=\{"\{editingId \? "Edit Image" : "Add Image"\}"\}/g, 'title={editingId ? "Edit Image" : "Add Image"}');
content = content.replace(/title=\{"\{editingId \? 'Edit Image' : 'Add Image'\}"\}/g, 'title={editingId ? "Edit Image" : "Add Image"}');
content = content.replace(/title=\{"\{editingId \? "Edit Testimonial" : "Add Testimonial"\}"\}/g, 'title={editingId ? "Edit Testimonial" : "Add Testimonial"}');

// Just to be absolutely safe, let's look for exactly the error string the user showed:
// title={"{editingId ? "Edit Image" : "Add Image"}"}
// Notice the double quotes inside double quotes! 
// This is exactly: title={"{editingId ? \"Edit Image\" : \"Add Image\"}"}
content = content.replace(/title=\{"\{editingId \? "Edit Image" : "Add Image"\}"\}/g, 'title={editingId ? "Edit Image" : "Add Image"}');
content = content.replace(/title=\{"\{editingId \? "Edit Testimonial" : "Add Testimonial"\}"\}/g, 'title={editingId ? "Edit Testimonial" : "Add Testimonial"}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed JSX syntax');
