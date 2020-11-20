const vm = require('vm');

const acorn = require('acorn');

const { execRegexOnAll, logWarning } = require('./utils/general-utils.js');
const { componentTagTranspiler } = require('./parsers/component-parser.js');

/**
 * @typedef {import('vm').Context} Context
 */

/**
 * Validates the Abell Block
 * @param {string[]} statementTypeMap
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
      'SYNTAX WARN: An Abell Block should not have multiple expressions that output values', // eslint-disable-line
      filename
    );
  }
}

/**
 * Returns statementTypeMap from javascript code
 * @param {string} jsCode JavaScript code to execute
 * @return {string[]}
 */
function getStatementTypeMap(jsCode) {
  /**
   * TODO:
   * Remove things from curly brackets {} in jsCode string since they are
   * anyway counted as a BlockStatement directly.
   */

  try {
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
  } catch (err) {
    // errors are caught by the vm module so we let code continue anyway
    return ['ExpressionStatement'];
  }
}

/**
 * Evaluates Abell Block value
 * @param {string} jsCode JavaScript code in string
 * @param {Context} context
 * @param {number} errLineOffset
 * @param {Object} options
 * @return {object}
 */
function evaluateAbellBlock(jsCode, context, errLineOffset, options) {
  const statementTypeMap = getStatementTypeMap(jsCode);
  validateAbellBlock(
    statementTypeMap,
    jsCode,
    `${options.filename}:${errLineOffset + 1}`
  );

  const script = new vm.Script(jsCode, {
    filename: options.filename,
    lineOffset: errLineOffset
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

  if (jsOutput === undefined || jsOutput === null) {
    return '';
  }

  if (typeof jsOutput === 'function') {
    return jsOutput();
  }

  if (Array.isArray(jsOutput)) {
    return jsOutput.join('');
  }

  return jsOutput;
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
  if (options.allowComponents) {
    // transpile tags from <Nav/> to {{ Nav().renderedHTML }}
    abellTemplate = componentTagTranspiler(abellTemplate); // transpile component tags
  }

  const { matches, input } = execRegexOnAll(/\\?{{(.+?)}}/gs, abellTemplate);
  let renderedHTML = '';
  let lastIndex = 0;

  for (const match of matches) {
    const [abellBlock, jsCode] = match;
    let evaluatedValue = '';
    const errLineOffset = (input.slice(0, match.index).match(/\n/g) || [])
      .length;

    if (abellBlock.startsWith('\\{{')) {
      // if block is comment (e.g \{{ I want to print this as it is }})
      evaluatedValue = abellBlock.slice(1);
    } else {
      evaluatedValue = evaluateAbellBlock(
        jsCode,
        context,
        errLineOffset,
        options
      );
    }

    const toAddOnIndex = match.index; // Gets the index where the executed value is to be put.
    renderedHTML +=
      input.slice(lastIndex, toAddOnIndex) + String(evaluatedValue).trim();
    lastIndex = toAddOnIndex + abellBlock.length;
  }

  renderedHTML += input.slice(lastIndex);

  return renderedHTML;
}

module.exports = { compile, evaluateAbellBlock, getStatementTypeMap };
