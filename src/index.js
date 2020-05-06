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
 * @returns updated sandbox
 */
function executeRequire(parseStatement, sandbox, basePath) {
  const requireParseRegex = /require\(['"](.*?)['"]\)/;

  const temp = require(
    path.join(
      basePath,
      requireParseRegex.exec(parseStatement)[1]
    )
  );


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

  delete context['temp'];

  return {...sandbox, ...context} 
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


/**
 * Captures groups from regex and executes RegEx.exec() function on all.
 * 
 * @param {regex} regex - Regular Expression to execute on.
 * @param {string} template - HTML Template in string.
 * 
 */
const execRegexOnAll = (regex, template) => {
  const allMatches = []; // This array will hold a list of all the JS expressions which are to be compiled
  let match = regex.exec(template); 
  const input = match['input']; 

  while(match !== null){
    delete match['input'];
    allMatches.push(match);
    match = regex.exec(template);
  }


  return {matches: allMatches, input};
}


/**
 * Outputs vanilla html string when abell template and sandbox is passed.
 * 
 * @param {string} abellTemplate - String of Abell File.
 * @param {any} sandbox - Object of variables. The template will be executed in context of this sandbox.
 * 
 */
function render(abellTemplate, sandbox, options = {basePath: ''}) {
  const {matches, input} = execRegexOnAll(/{{(.*?)}}/gs, abellTemplate) // Finds all the JS expressions to be executed.
  let renderedHTML = ''; 
  let lastIndex = 0;
  let value = '';
  
  for(let match of matches) { // Loops Through JavaScript blocks inside '{{' and '}}'
    if(match[1].includes('require(')) {
      // the js block is trying to require
      sandbox = executeRequire(match[1], sandbox, options.basePath);
    }else if(match[1].includes("= ")) {
      // assignment operator
      sandbox = executeAssignment(match[1], sandbox);
    }else {
      value = execute(match[1], sandbox); // Executes the expression value in the sandbox environment
    }


    // removes the javascript line before adding to HTML and if the script returns value, adds it to the HTML
    const toAddOnIndex = match['index']; // Gets the index where the executed value is to be put.
    renderedHTML += input.slice(lastIndex, toAddOnIndex) + value; 
    lastIndex = toAddOnIndex + match[0].length; 
  }

  renderedHTML += input.slice(lastIndex);
  return renderedHTML;
}


module.exports = {
  render,
  execute
}