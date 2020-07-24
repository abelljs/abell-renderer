const fs = require('fs');
const { execRegexOnAll } = require('./render-utils.js');
const { compile } = require('./compiler.js');

/**
 * Parses component tags (<Nav/> -> Nav().template.content)
 * @param {String} abellTemplate
 * @return {String}
 */
function parseComponentTags(abellTemplate) {
  abellTemplate = String(abellTemplate);
  // eslint-disable-next
  const componentVariables = execRegexOnAll(
    /(?:const|var|let) (\w*) *?= *?require\(["'`](.*?)\.abell["'`]\)/g,
    abellTemplate
  ).matches.map((match) => match[1]);

  let newAbellTemplate = '';
  const componentParseREGEX = new RegExp(
    `\<(${componentVariables.join('|')}) *?(?:props=(.*?)?)?\/\>`,
    'g'
  );

  const { matches: componentMatches } = execRegexOnAll(
    componentParseREGEX,
    abellTemplate
  );

  let lastIndex = 0;
  for (const componentMatch of componentMatches) {
    newAbellTemplate +=
      abellTemplate.slice(lastIndex, componentMatch.index) +
      `{{ ${componentMatch[1]}(${componentMatch[2]}).renderedHTML }}`;

    lastIndex = componentMatch[0].length + componentMatch.index;
  }

  newAbellTemplate += abellTemplate.slice(lastIndex);

  return newAbellTemplate;
}

/**
 *
 * @param {String} abellComponentPath
 * @param {Object} props
 * @return {Object}
 */
function parseComponent(abellComponentPath, props) {
  const abellComponentContent = fs.readFileSync(abellComponentPath, 'utf-8');
  const htmlComponentContent = compile(abellComponentContent, { props });
  const template = /\<template\>(.*?)\<\/template\>/gs.exec(
    htmlComponentContent
  )[1];

  const styles = /\<style\>(.*?)\<\/style\>/gs.exec(htmlComponentContent)[1];
  const scripts = /\<script\>(.*?)\<\/script\>/gs.exec(htmlComponentContent)[1];

  return {
    renderedHTML: template,
    styles: [
      {
        content: styles,
        attributes: []
      }
    ],
    scripts: [
      {
        content: scripts,
        attributes: []
      }
    ]
  };
}

module.exports = { parseComponent, parseComponentTags };
