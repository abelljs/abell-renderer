const vm = require('vm');
const path = require('path');

/**
 * 
 * @param {string} parseStatement string of require statement (e.g. const a = require('module'))
 * @param {object} sandbox variable environtment to execute upon
 * @param {string} basePath base path to which the require will be relative
 * @returns updated sandbox
 */
function executeRequireStatement(parseStatement, sandbox, basePath) {
  const requireParseRegex = /require\(['"](.*?)['"]\)/;

  const pathToRequire = requireParseRegex.exec(parseStatement)[1];
  let temp;

  if(pathToRequire.startsWith('.')) {
    // path is a local file
    temp = require(
      path.join(
        basePath,
        pathToRequire
      )
    );
  }else{
    // path is a nodejs module
    temp = require(pathToRequire);
  }


  const context = {temp}
  vm.createContext(context)
  
  vm.runInContext(
    parseStatement
      .slice(0, parseStatement.indexOf('='))
      .replace(/(?:const |let )/g, 'var ')
      .trim()
    + " = temp"
    , context
  )

  delete context['temp']; // delete the temporary created variable

  return {...sandbox, ...context} 
}



/**
 * Executes the JavaScript code from string
 * 
 * @param {string} jsToExecute - JavaScript code in String to parse and execute
 * @param {any} sandbox - The variables and all the information required by program
 */
function execute(jsToExecute, sandbox = {}) {
  const numOfKeysBeforeExecution = Object.keys(sandbox).length;
  const codeToExecute = "aBellSpecificVariable = " + jsToExecute.replace(/(?:const |let |var )/g, '');
  const script = new vm.Script(codeToExecute);
  const context = new vm.createContext(sandbox);
  script.runInContext(context);
  
  const sandboxVariable = sandbox.aBellSpecificVariable; 

  if(jsToExecute.includes('=')) {
    // A chance of script being an assignment

    // if new variable is added to the context, (which means the script added a new variable and was an assignment)
    if((Object.keys(sandbox).length - 1) > numOfKeysBeforeExecution) {
      delete sandbox['aBellSpecificVariable'];
      return {
        type: 'assignment',
        sandbox
      };
    }

    // if a predefined variable is assigned a new value, it will escape the conditions above
    const textToLookEqualSignIn = jsToExecute.replace(/`(?:.*?)`|"(?:.*?)"|'(?:.*?)'/gs, "");
    if(textToLookEqualSignIn.match(/[\w\d ]={1}(?![>=])/g) !== null) {
      // It is 90% chance that it is assignment
      delete sandbox['aBellSpecificVariable'];
      return {
        type: 'assignment',
        sandbox
      }
    }
    
  }
  
  // script is not assignment i.e it returns some value that can be printed
  return {
    type: 'value',
    value: sandboxVariable,
    sandbox
  };

}

module.exports = {
  execute,
  executeRequireStatement
}