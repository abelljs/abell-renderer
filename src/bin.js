#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const abellRenderer = require('./index.js');

const green = (message) => `\u001b[32m${message}\u001b[39m`;  

/**
 * @method build
 * @return {void}
 */
function build() {
  const startTime = new Date().getTime();
  const inputFilePath = args[args.indexOf('--input') + 1];
  console.log("Input file path is");
  console.log(inputFilePath)
  const basePath = path.join(
    process.cwd(), 
    path.dirname(inputFilePath)
  );
  console.log(`${ green('-') } Rendering started ✨ \n`);

  if(inputFilePath.split(".").length>1) // Input is a single file
  {
    console.log(`${ green('-') } Input is a single file ✨ \n`);
    const indexOfOutput = args.indexOf('--output');
    const outputFileFullPath = (indexOfOutput > -1) 
      ? path.join(process.cwd(), args[indexOfOutput + 1]) 
      : path.join(
        basePath, 
        path.basename(inputFilePath, path.extname(inputFilePath)) + '.html' // file name of input
      );
    const htmlTemplate = abellRenderer.render(  
      fs.readFileSync(path.join(process.cwd(), inputFilePath)), 
      {},
      {
        basePath
      }
    );
    
    fs.writeFileSync(outputFileFullPath, htmlTemplate);
    const executionTime = new Date().getTime() - startTime;
    console.log(`${green('>>')} Abell template built at ${outputFileFullPath.replace(process.cwd(), '')} 🌻 (Built in ${executionTime}ms) \n`); // eslint-disable-line
  }
  else // Input is a directory
  {
    console.log(`${ green('-') } Input is a folder ✨ \n`);
    const indexOfOutput = args.indexOf('--output');
    const outputFileFullPath = (indexOfOutput > -1) 
      ? path.join(process.cwd(), args[indexOfOutput + 1]) 
      : path.join(
        basePath, 
        path.basename(inputFilePath, path.extname(inputFilePath))  // file name of input
      );
    console.log(outputFileFullPath);
    fs.readdirSync(inputFilePath).forEach(file=>{
      console.log(`${ green('-') } 📜 Rendering ${file}`)
      const data = fs.readFileSync(path.join(process.cwd(),inputFilePath,file),{encoding:'utf8', flag:'r'});
      const htmlTemplate = abellRenderer.render(data,{},{basePath})
      fs.writeFileSync(outputFileFullPath+"/"+file, htmlTemplate);
      console.log(`${ green('-') } ✅ Rendered ${file}`)
    })
        const executionTime = new Date().getTime() - startTime;
    console.log(`${green('>>')} Abell template built at ${outputFileFullPath.replace(process.cwd(), '')} 🌻 (Built in ${executionTime}ms) \n`); // eslint-disable-line

  }
  
  
  
  

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
