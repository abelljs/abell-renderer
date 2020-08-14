#!/usr/bin/env node

/**
 * This file includes code for the CLI of abell renderer
 * The code for the actual library is in 'src'
 */

const fs = require('fs');
const path = require('path');
const abellRenderer = require('../src/index.js');

const green = (message) => `\u001b[32m${message}\u001b[39m`;

const cwd = process.cwd();

const recursiveFind = (base, ext, inputFiles, inputResult) => {
  const files = inputFiles || fs.readdirSync(base);
  let result = inputResult || [];

  for (const file of files) {
    const newbase = path.join(base, file);
    if (fs.statSync(newbase).isDirectory()) {
      result = recursiveFind(newbase, ext, fs.readdirSync(newbase), result);
    } else {
      if (file.substr(-1 * ext.length) == ext) {
        result.push(newbase);
      }
    }
  }

  return result;
};

/**
 * Recursively creates the path
 * @param {String} pathToCreate path that you want to create
 */
function createPathIfAbsent(pathToCreate) {
  // prettier-ignore
  pathToCreate
    .split(path.sep)
    .reduce((prevPath, folder) => {
      const currentPath = path.join(prevPath, folder, path.sep);
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }
      return currentPath;
    }, '');
}

/**
 * @method generateHTMLFromAbell
 * @param {string} inputPath - A complete input path of the .abell file
 * @param {string} outputPath - A complete output path
 * @param {Object} abellRenderOptions
 * @param {String} abellRenderOptions.basePath - Base Path to file requires
 * @return {void}
 */
function generateHTMLFromAbell(inputPath, outputPath, abellRenderOptions) {
  console.log(`${green('-')} 📜 Rendering ${inputPath.replace(cwd, '')}`);
  createPathIfAbsent(path.dirname(outputPath));
  const data = fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' });

  const htmlTemplate = abellRenderer.render(data, {}, abellRenderOptions);
  fs.writeFileSync(outputPath, htmlTemplate);

  console.log(`${green('-')} ✔️  Rendered`);
}

/**
 * @method build
 * @return {void}
 */
function build() {
  const startTime = new Date().getTime();
  const inputPath = path.join(cwd, args[args.indexOf('--input') + 1]);
  const indexOfOutput = args.indexOf('--output');
  const outputPath =
    indexOfOutput > -1
      ? path.join(cwd, args[indexOfOutput + 1])
      : inputPath.replace('.abell', '.html'); // file name of input
  const allowRequire = args.includes('--allow-require');

  const basePath = path.dirname(inputPath);

  console.log(`${green('-')} Rendering started ✨ \n`);

  if (!fs.statSync(inputPath).isDirectory()) {
    // If input is a file
    generateHTMLFromAbell(inputPath, outputPath, { basePath, allowRequire });
  } else {
    // If input is a directory
    const relativePaths = recursiveFind(
      inputPath,
      '.abell'
    ).map((absolutePath) => path.relative(inputPath, absolutePath));

    for (const filepath of relativePaths) {
      generateHTMLFromAbell(
        path.join(inputPath, filepath),
        path.join(outputPath, filepath.replace('.abell', '.html')),
        { basePath: path.dirname(path.join(inputPath, filepath)), allowRequire }
      );
    }
  }

  const executionTime = new Date().getTime() - startTime;
  console.log(
    `\n\n${green('>>')} Abell template built at ${outputPath.replace(
      cwd,
      ''
    )} 🌻 (Built in ${executionTime}ms) \n`
  ); // eslint-disable-line
}

/** Print Help */
function printHelp() {
  console.log('\nbuild --input [path-to-abell] --output [path-to-output]\n\n');
}

// Main
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  // Build HTML from ABELL
  case 'build':
    build();
    break;

  // Print Help
  case '--help':
  case 'help':
    printHelp();
    break;

  // Check version
  case '-v':
  case '--version':
    console.log(require('../package.json').version);
    break;

  default:
    console.log('Command not found. Did you mean build?');
}
