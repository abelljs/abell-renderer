#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const abellRenderer = require('./index.js');

const green = (message) => `\u001b[32m${message}\u001b[39m`;  


const cwd = process.cwd();

/**
 * @method generateHTMLFromAbell
 * @param {string} inputPath - A complete input path of the .abell file
 * @param {string} outputPath - A complete output path
 * @param {Object} abellRenderOptions
 * @param {String} abellRenderOptions.basePath - Base Path to file requires
 * @return {void}
 */
function generateHTMLFromAbell(inputPath, outputPath, abellRenderOptions) {
  console.log(`${ green('-') } 📜 Rendering ${inputPath.replace(cwd, '')}`);

  const data = fs.readFileSync(
    inputPath,
    {encoding: 'utf8', flag: 'r'}
  );

  const htmlTemplate = abellRenderer.render(data, {}, abellRenderOptions);
  fs.writeFileSync(
    outputPath, 
    htmlTemplate
  );

  console.log(`${ green('-') } ✔️  Rendered`);
}

/**
 * @method build
 * @return {void}
 */
function build() {
  const startTime = new Date().getTime();
  const inputPath = path.join(cwd, args[args.indexOf('--input') + 1]);
  const indexOfOutput = args.indexOf('--output');
  const outputPath = (indexOfOutput > -1) 
    ? path.join(cwd, args[indexOfOutput + 1]) 
    : inputPath.replace('.abell', '.html'); // file name of input
  
  const basePath = path.dirname(inputPath);

  console.log(`${ green('-') } Rendering started ✨ \n`);

  if (!fs.statSync(inputPath).isDirectory()) {
    // If input is a file
    generateHTMLFromAbell(inputPath, outputPath, {basePath});
  } else {
    // If input is a directory
    const filesInDirectory = fs.readdirSync(inputPath);

    for (const file of filesInDirectory) {
      generateHTMLFromAbell(
        path.join(inputPath, file), 
        path.join(outputPath, file.replace('.abell', '.html')), 
        {basePath: path.dirname(path.join(inputPath, file))}
      );
    }
  }

  const executionTime = new Date().getTime() - startTime;
  console.log(`\n\n${green('>>')} Abell template built at ${outputPath.replace(cwd, '')} 🌻 (Built in ${executionTime}ms) \n`); // eslint-disable-line
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
