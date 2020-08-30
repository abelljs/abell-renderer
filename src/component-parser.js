const fs = require('fs');
const path = require('path');

const { execRegexOnAll, abellRequire } = require('./render-utils.js');
const { compile } = require('./compiler.js');
const { cssSerializer } = require('./parsers/css');
const { prefixHtmlTags } = require('./post-compilation');
const hash = require('./hash');
/**
 * Parses component tags (<Nav/> -> Nav().renderedHTML)
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

  if (componentVariables.length <= 0) {
    return abellTemplate;
  }

  let newAbellTemplate = '';
  const componentParseREGEX = new RegExp(
    `\<(${componentVariables.join('|')}).*?(?:props=(.*?))?\/\>`,
    'gs'
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
 * Parses attributes with space separate string to object
 * @param {String} attributeString
 * @return {Object}
 */
const parseAttribute = (attributeString) => {
  const attributeArr = attributeString
    .split(/\s/)
    .filter((attribute) => !!attribute)
    .reduce((prev, attribute) => {
      const indexOfEqual = attribute.indexOf('=');
      let key;
      let value;
      if (indexOfEqual < 0) {
        // does not have a value so we give 'true' as a default value
        key = attribute;
        value = true;
      } else {
        key = attribute.slice(0, indexOfEqual);
        value = attribute.slice(indexOfEqual + 1);
        if (value && (value.startsWith("'") || value.startsWith('"'))) {
          value = value.slice(1, -1);
        }
      }
      prev[key] = value;
      return prev;
    }, {});

  return attributeArr;
};

/**
 *
 * @param {String} abellComponentPath
 * @param {Object} props
 * @param {Object} options
 * @return {Object}
 */
function parseComponent(abellComponentPath, props = {}, options) {
  let abellComponentContent = fs.readFileSync(abellComponentPath, 'utf-8');
  if (!abellComponentContent.trim().startsWith('<AbellComponent>')) {
    throw new Error( // eslint-disable-next-line max-len
      `Abell Component should be wrapped inside <AbellComponent></AbellComponent>. \n >> Error requiring ${abellComponentPath}\n`
    );
  }
  abellComponentContent = parseComponentTags(abellComponentContent);
  const basePath = path.dirname(abellComponentPath);
  const components = [];
  const sandbox = {
    props,
    require: (pathToRequire) => {
      if (pathToRequire.endsWith('.abell')) {
        return (userProps) => {
          const component = parseComponent(
            path.join(basePath, pathToRequire),
            userProps,
            { ...options, skipHTMLHash: true }
          );
          components.push(component);
          return component;
        };
      }

      return abellRequire(pathToRequire, { ...options, basePath });
    },
    console: { log: console.log }
  };
  const htmlComponentContent = compile(abellComponentContent, sandbox, {
    filename: path.relative(process.cwd(), abellComponentPath)
  });

  const templateTag = /\<template\>(.*?)\<\/template\>/gs.exec(
    htmlComponentContent
  );

  const componentHash = hash(abellComponentPath);

  let template = '';

  if (templateTag) {
    template = templateTag[1];
  }
  if (!options.skipHTMLHash) {
    template = prefixHtmlTags(template, componentHash);
  }

  const matchMapper = (isCss) => (contentMatch) => {
    const attributes = parseAttribute(contentMatch[1]);
    const shouldPrefix = isCss && !attributes.global;
    return {
      component: path.basename(abellComponentPath),
      componentPath: abellComponentPath,
      content: shouldPrefix
        ? cssSerializer(contentMatch[2], componentHash)
        : contentMatch[2],
      attributes: parseAttribute(contentMatch[1])
    };
  };

  const styleMatches = execRegexOnAll(
    /\<style(.*?)\>(.*?)\<\/style\>/gs,
    htmlComponentContent
  ).matches.map(matchMapper(true));

  const scriptMatches = execRegexOnAll(
    /\<script(.*?)\>(.*?)\<\/script\>/gs,
    htmlComponentContent
  ).matches.map(matchMapper(false));

  return {
    renderedHTML: template,
    components,
    styles: styleMatches,
    scripts: scriptMatches
  };
}

module.exports = { parseComponent, parseComponentTags, parseAttribute };
