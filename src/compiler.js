const vm = require('vm');

const acorn = require('acorn');

const { execRegexOnAll, logWarning } = require('./utils.js');
const { componentTagTranspiler } = require('./component-parser.js');

/**
 * @typedef {import('vm').Context} Context
 */

/**
 * Validates the Abell Block
 * @param {[string]} statementTypeMap
 * @param {string} jsCode
 * @param {string} filename
 */
function validateAbellBlock(statementTypeMap, jsCode, filename) {
  if (
    !statementTypeMap.includes('VariableDeclaration') &&
    !statementTypeMap.includes('AssignmentExpression') &&
    statementTypeMap.length > 1
  ) {
    console.log('\nWARNING:');
    console.log('{{\n>' + jsCode + '\n}}');
    logWarning(
      'SYNTAX WARN: An Abell Block should not have multiple expressions that output value', // eslint-disable-line
      filename
    );
  }
}

/**
 * Returns statementTypeMap from javascript code
 * @param {string} jsCode JavaScript code to execute
 * @return {[string]}
 */
function getStatementTypeMap(jsCode) {
  const ast = acorn.parse(jsCode, { ecmaVersion: 2020 }).body;
  return ast.map((astNode) => {
    if (
      astNode.type === 'ExpressionStatement' &&
      astNode.expression.type === 'AssignmentExpression'
    ) {
      return 'AssignmentExpression';
    }

    return astNode.type;
  });
}

/**
 * Evaluates Abell Block value
 * @param {string} jsCode JavaScript code in string
 * @param {Context} context
 * @param {Object} options
 * @return {object}
 */
function evaluateAbellBlock(jsCode, context, options) {
  const statementTypeMap = getStatementTypeMap(jsCode);
  validateAbellBlock(statementTypeMap, jsCode, options.filename);
  const script = new vm.Script(jsCode, {
    filename: options.filename || '.abell'
  });

  const jsOutput = script.runInContext(context, {
    displayErrors: true
  });

  if (
    statementTypeMap[statementTypeMap.length - 1] === 'AssignmentExpression'
  ) {
    // for {{ a = 3 }} it should not print anything so we return blank string
    return '';
  }

  if (typeof jsOutput === 'function') {
    return jsOutput();
  }

  if (Array.isArray(jsOutput)) {
    return jsOutput.join('');
  }

  return jsOutput || '';
}

/**
 * Turns Abell Template to HTML Code
 * @param {string} abellTemplate
 * @param {object} sandbox
 * @param {object} options
 * @return {string}
 */
function compile(abellTemplate, sandbox, options) {
  const context = new vm.createContext(sandbox); // eslint-disable-line
  abellTemplate = componentTagTranspiler(abellTemplate); // transpile component tags
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
      evaluatedValue = evaluateAbellBlock(jsCode, context, options);
    }

    const toAddOnIndex = match.index; // Gets the index where the executed value is to be put.
    renderedHTML +=
      input.slice(lastIndex, toAddOnIndex) + String(evaluatedValue).trim();
    lastIndex = toAddOnIndex + abellBlock.length;
  }

  renderedHTML += input.slice(lastIndex);

  return renderedHTML;
}

module.exports = { compile, evaluateAbellBlock };
