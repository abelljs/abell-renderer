const vm = require('vm');

/**
 * Executes the JavaScript code from string
 *
 * @param {string} jsToExecute
 *  JavaScript code in String to parse and execute
 * @param {any} sandbox
 *  The variables and all the information required by program
 * @param {Object} options
 * @return {object} {type, sandbox, value?}
 */
function execute(jsToExecute, sandbox = {}, options) {
  const numOfKeysBeforeExecution = Object.keys(sandbox).length;
  const codeToExecute = jsToExecute.replace(/(?:const |let )/g, 'var ');

  const script = new vm.Script(codeToExecute, {
    filename: options.filename,
    lineOffset: options.lineOffset || 0
  });
  const context = new vm.createContext(sandbox); // eslint-disable-line

  const sandboxVariable = script.runInContext(context, {
    displayErrors: true
  });

  if (jsToExecute.includes('=')) {
    // A chance of script being an assignment

    /**
     *  if new variable is added to the context,
     *  (which means the script added a new variable and was an assignment)
     */

    if (Object.keys(sandbox).length - 1 > numOfKeysBeforeExecution) {
      return {
        type: 'assignment',
        sandbox
      };
    }

    // if a predefined variable is assigned a new value, it will escape the conditions above

    const textToLookEqualSignIn = jsToExecute.replace(
      /`(?:.*?)`|"(?:.*?)"|'(?:.*?)'/gs,
      ''
    ); // removes strings to avoid checking equal-to signs inside string

    // Look for word-equalsign-word
    if (textToLookEqualSignIn.match(/[\w\d ]={1}(?![>=])/g) !== null) {
      // 90% chance that this is an assignment
      return {
        type: 'assignment',
        sandbox
      };
    }
  }
  // script is not assignment i.e it returns some value that can be printed
  return {
    type: 'value',
    value: sandboxVariable,
    sandbox
  };
}

module.exports = execute;
