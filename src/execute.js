const vm = require('vm');
const path = require('path');

/**
 * 
 * @param {string} statement statement to execute (e.g `const a = 3`)
 * @param {object} sandbox variable environtment to execute upon
 * @returns updated sandbox
 */
function executeAssignment(statement, sandbox) {
  // to add variable to context, the variable needs to be defined with `var` only so we replace const and let to var before execution
  const script = new vm.Script(statement.replace(/(?:const |let )/g, 'var '));
  const context = new vm.createContext(sandbox);
  script.runInContext(context);
  return sandbox;
}


/**
 * 
 * @param {string} parseStatement string of require statement (e.g. const a = require('module'))
 * @param {object} sandbox variable environtment to execute upon
 * @param {string} basePath base path to which the require will be relative
 * @returns updated sandbox
 */
function executeRequire(parseStatement, sandbox, basePath) {
  const lines = parseStatement.trim().split('\n');
  var globalContext = {};
  lines.forEach(line=>{

    const requireParseRegex = /require\(['"](.*?)['"]\)/;
    const pathToRequire = requireParseRegex.exec(line)[1];
    let temp;
    if(pathToRequire.startsWith('./')) {
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


    context = {temp}
    vm.createContext(context)

    vm.runInContext(
      line
        .slice(0, line.indexOf('='))
        .replace(/(?:const |let )/g, 'var ')
        .trim()
      + " = temp"
      , context
    )
    console.log("--CONTEXT--");
    console.log(context);
    delete context['temp']; // delete the temporary created variable
    globalContext = {...globalContext,...context};
  
  })

  return {...sandbox, ...globalContext} 
}




/**
 * Executes the JavaScript code from string
 * 
 * @param {string} jsToExecute - JavaScript code in String to parse and execute
 * @param {any} sandbox - The variables and all the information required by program
 */
function execute(jsToExecute, sandbox = {}) {
  const script = new vm.Script('output = ' + jsToExecute);

  const context = new vm.createContext(sandbox);
  script.runInContext(context);

  if(typeof sandbox.output === 'function') {
    return sandbox.output();
  }
  
  return sandbox.output;
}

module.exports = {
  execute,
  executeAssignment,
  executeRequire
}