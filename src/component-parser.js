const fs = require('fs');
const { execRegexOnAll } = require('./render-utils.js');

/**
 * Parses component tags (<Nav/> -> Nav().template.content)
 * @param {String} abellTemplate
 * @return {String}
 */
function parseComponentTags(abellTemplate) {
  // eslint-disable-next
  const componentVariables = execRegexOnAll(
    /(?:const|var|let) (\w*) *?= *?require\(["'`](.*?)\.abell["'`]\)/g,
    abellTemplate
  ).matches.map((match) => match[1]);
  let newAbellTemplate = abellTemplate;
  for (const componentVariable of componentVariables) {
    const componentParseREGEX = new RegExp(`<${componentVariable}(.*?)/>`, 'g');
    newAbellTemplate = String(abellTemplate).replace(
      componentParseREGEX,
      `{{ ${componentVariable}().template.content }}`
    );
  }

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
  const template = /\<template\>(.*?)\<\/template\>/gs.exec(
    abellComponentContent
  )[1];

  const styles = /\<style\>(.*?)\<\/style\>/gs.exec(abellComponentContent)[1];
  const scripts = /\<script\>(.*?)\<\/script\>/gs.exec(
    abellComponentContent
  )[1];

  console.log(props);
  return {
    template: {
      content: template,
      attributes: []
    },
    styles: [
      {
        content: styles,
        attributes: []
      }
    ],
    script: [
      {
        content: scripts,
        attributes: []
      }
    ]
  };
}

module.exports = { parseComponent, parseComponentTags };
