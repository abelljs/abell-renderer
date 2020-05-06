const fs = require('fs');
const path = require('path');
const abellRenderer = require('../index.js');

// Sandox holds parameters values are used in abell file
const sandbox = {
  $contentList: [
    {name: 'Nice'},
    {name: 'very cool'}
  ]
};

// Transforms the abell file into HTML and stores in variable htmlTemplate
const htmlTemplate = abellRenderer.render(  
  fs.readFileSync(path.join(__dirname, 'index.abell')), 
  sandbox,
  {
    basePath: __dirname
  }
);
// The transformed abell file content stored in htmlTemplate is written to index.html 
fs.writeFileSync(path.join(__dirname, 'index.html'), htmlTemplate);

console.log("🎉 Output generated at src/example/index.html 🌻");