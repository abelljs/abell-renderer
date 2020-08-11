/**
 * This is the script that is executed on npm run example,
 * it is for developers to run and try examples
 *
 * USAGE:
 * npm run example <name-of-example-folder>
 *
 * E.G.
 * npm run example main
 *
 * This will run the examples/main/input.abell
 */

const fs = require('fs');
const path = require('path');
const abellRenderer = require('../src/index.js');
const { exec } = require('child_process');

const args = process.argv.slice(2);
const exampleToRun = args[0];
if (!fs.existsSync(path.join(__dirname, exampleToRun))) {
  throw new Error('The example does not exist, try npm run example main');
}

if (exampleToRun === 'cli-example') {
  throw new Error('Use npm run example:cli to run CLI example');
}

/**
 * if example has index.js, then execute index.js instead of this file.
 */
if (fs.existsSync(path.join(__dirname, exampleToRun, 'index.js'))) {
  console.log(
    `>> Found index.js in the examples/${exampleToRun}, running index.js`
  );

  exec(`node examples/${exampleToRun}/index.js`, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
  });
  return;
}

console.log('>> Running ' + exampleToRun);

// Sandox holds parameters values are used in abell file
const sandbox = {
  $contentList: [{ name: 'Nice' }, { name: 'very cool' }]
};

// Transforms the abell file into HTML and stores in variable htmlTemplate
const htmlTemplate = abellRenderer.render(
  fs.readFileSync(path.join(__dirname, exampleToRun, 'in.abell')),
  sandbox,
  {
    basePath: path.join(__dirname, exampleToRun),
    allowRequire: true,
    filename: path.relative(
      process.cwd(),
      path.join(__dirname, exampleToRun, 'in.abell')
    )
  }
);

// The transformed abell file content stored in htmlTemplate is written to index.html
fs.writeFileSync(path.join(__dirname, exampleToRun, 'out.html'), htmlTemplate);

console.log(`🎉 Output generated at examples/${exampleToRun}/out.html 🌻`);
