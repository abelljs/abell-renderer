const vm = require('vm');
/**
 * @typedef {import('vm').Context} Context
 */

/**
 * Runs JavaScript
 * @param {string} codeToExecute Executes JavaScript
 * @param {Context} context Context Sandbox
 * @return {any}
 */
function runJS(codeToExecute, context) {
  const script = new vm.Script(codeToExecute, { filename: 'hello.abell' });

  const sandboxVariable = script.runInContext(context, {
    displayErrors: true
  });

  return sandboxVariable;
}

/**
 * Evaluates Abell Block value
 * @param {string} jsCode JavaScript code in string
 * @param {Context} context
 * @return {object}
 */
function evaluateAbellBlock(jsCode, context) {
  const jsOutput = runJS(jsCode, context);

  if (Array.isArray(jsOutput)) {
    return jsOutput.join('');
  }

  return jsOutput || '';
}

module.exports = { evaluateAbellBlock };
