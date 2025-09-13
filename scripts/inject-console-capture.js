const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Read the console capture script
const scriptPath = path.join(__dirname, '..', 'public', 'dashboard-console-capture.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Create the inline script tag
const scriptTag = `<script>${scriptContent}</script>`;

// Find all HTML files in the build output
const buildDir = path.join(__dirname, '..', '.next', 'server', 'app');
const htmlFiles = glob.sync('**/page.html', { cwd: buildDir });

console.log(`Injecting console capture script into ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Inject script before closing head tag or at the beginning of body
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${scriptTag}</head>`);
  } else if (content.includes('<body')) {
    content = content.replace(/<body([^>]*)>/, `<body$1>${scriptTag}`);
  } else {
    // Fallback: add at the beginning of the content
    content = scriptTag + content;
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Injected into ${file}`);
});

console.log('Console capture script injection complete!');