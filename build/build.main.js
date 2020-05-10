const fse = require('fs-extra');

fse.copySync('src', 'dist');
fse.removeSync('dist/example');
const version = require('../package.json').version;

console.log(`abell-renderer v${version} build ready in dist folder 🌻`);
