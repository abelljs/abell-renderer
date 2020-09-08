const vm = require('vm');

const { execRegexOnAll } = require('./utils');

/**
 * @typedef {import('vm').Context} Context
 */

/**
 * Evaluates Abell Block value
 * @param {string} jsCode JavaScript code in string
 * @param {Context} context
 * @return {object}
 */
function evaluateAbellBlock(jsCode, context) {
  const script = new vm.Script(jsCode, { filename: 'hello.abell' });
  const jsOutput = script.runInContext(context, {
    displayErrors: true
  });

  if (Array.isArray(jsOutput)) {
    return jsOutput.join('');
  }

  return jsOutput || '';
}

/**
 * Turns Abell Template to HTML Code
 * @param {string} abellTemplate
 * @param {Context} context
 * @param {object} options
 * @return {string}
 */
function compile(abellTemplate, context, options) {
  const { matches, input } = execRegexOnAll(/\\?{{(.+?)}}/gs, abellTemplate);
  let renderedHTML = '';
  let lastIndex = 0;

  for (const match of matches) {
    const [abellBlock, jsCode] = match;
    let evaluatedValue = '';

    if (abellBlock.startsWith('\\{{')) {
      // if block is comment (e.g \{{ I want to print this as it is }})
      evaluatedValue = abellBlock.slice(1);
    } else {
      evaluatedValue = evaluateAbellBlock(jsCode, context);
    }

    const toAddOnIndex = match.index; // Gets the index where the executed value is to be put.
    renderedHTML +=
      input.slice(lastIndex, toAddOnIndex) + String(evaluatedValue).trim();
    lastIndex = toAddOnIndex + abellBlock.length;
  }

  renderedHTML += input.slice(lastIndex);

  return renderedHTML;
}

module.exports = compile;
