const vm = require('vm');
const { cleanErrorStack } = require('./render-utils.js');

/**
 * Executes the JavaScript code from string
 *
 * @param {string} jsToExecute
 *  JavaScript code in String to parse and execute
 * @param {any} sandbox
 *  The variables and all the information required by program
 * @return {object} {type, sandbox, value?}
 */
function execute(jsToExecute, sandbox = {}) {
  const numOfKeysBeforeExecution = Object.keys(sandbox).length;
  const codeToExecute =
    'aBellSpecificVariable = ' +
    jsToExecute.replace(/(?:const |let |var )/g, '');

  const script = new vm.Script(codeToExecute);
  const context = new vm.createContext(sandbox); // eslint-disable-line

  try {
    script.runInContext(context, {
      displayErrors: true
    });
  } catch (err) {
    if (!err.stack.includes('Error in .abell file.')) {
      console.log('\n>> .abell Error:');
      console.log('='.repeat(process.stdout.columns));
      console.error(cleanErrorStack(err.stack));
      console.log('='.repeat(process.stdout.columns));
      console.log('\n');
    }
    throw new Error('Error in .abell file. More logs above || ' + err.message);
  }
  const sandboxVariable = sandbox.aBellSpecificVariable;

  if (jsToExecute.includes('=')) {
    // A chance of script being an assignment

    /**
     *  if new variable is added to the context,
     *  (which means the script added a new variable and was an assignment)
     */

    if (Object.keys(sandbox).length - 1 > numOfKeysBeforeExecution) {
      delete sandbox.aBellSpecificVariable;
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
      delete sandbox.aBellSpecificVariable;
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
