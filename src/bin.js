#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const abellRenderer = require('./index.js');

const args = process.argv.slice(2);

const inputFilePath = args[args.indexOf('--input') + 1];

const basePath = path.join(
  process.cwd(), 
  path.dirname(inputFilePath)
);

console.log(path.basename(inputFilePath, path.extname(inputFilePath)))

const indexOfOutput = args.indexOf('--output');
const outputFileFullPath = (indexOfOutput > -1) 
  ? path.join(process.cwd(), args[indexOfOutput + 1]) 
  : path.join(
      basePath, 
      path.basename(inputFilePath, path.extname(inputFilePath)) + ".html"// file name of input
    );


const htmlTemplate = abellRenderer.render(  
  fs.readFileSync(path.join(process.cwd(), inputFilePath)), 
  {},
  {
    basePath
  }
);

fs.writeFileSync(outputFileFullPath, htmlTemplate);