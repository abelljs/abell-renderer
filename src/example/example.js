const fs = require('fs');
const path = require('path');
const abellRenderer = require('../index.js');

const sandbox = {
  $contentList: [
    {name: 'Nice'},
    {name: 'very cool'}
  ],
  globalMeta: {
    siteName: 'This is my siteName',
    name: 'This is my name',
    twitter: 'saurabhcodes'
  }
};

const htmlTemplate = abellRenderer.render(
  fs.readFileSync(path.join(__dirname, 'index.abell')), 
  sandbox
);

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlTemplate);