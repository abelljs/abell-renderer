const fs = require('fs');
const path = require('path');
const abellRenderer = require('../index.js');

console.log('>> Running src/example/example.js');

// Sandox holds parameters values are used in abell file
const sandbox = {
  $contentList: [
    {name: 'Nice'},
    {name: 'very cool'}
  ]
};

// Transforms the abell file into HTML and stores in variable htmlTemplate
const htmlTemplate = abellRenderer.render(  
  fs.readFileSync(path.join(__dirname, 'templates', 'inject_example.abell')), 
  sandbox,
  {
    basePath: path.join(__dirname, 'templates')
  }
);
// The transformed abell file content stored in htmlTemplate is written to index.html 
fs.writeFileSync(path.join(__dirname, 'out', 'inject_example.html'), htmlTemplate);

console.log('🎉 Output generated at src/example/out/inject_example.html 🌻');
