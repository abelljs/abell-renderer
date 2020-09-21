const fs = require('fs');
const path = require('path');

const abellRenderer = require('../../src/index.js');

const abellTemplate = fs.readFileSync(
  path.join(__dirname, 'in.abell'),
  'utf-8'
);

const { html, components } = abellRenderer.render(
  abellTemplate,
  {
    foo: 'Hehhe'
  },
  {
    allowRequire: true,
    allowComponents: true,
    filename: path.join(__dirname, 'in.abell'),
    basePath: __dirname
  }
);

console.log(html);
console.dir(components, { depth: Infinity });

fs.writeFileSync(path.join(__dirname, 'out.html'), html);
