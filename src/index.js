const vm = require('vm');

/**
 * Executes the JavaScript code from string
 * 
 * @param {string} jsToExecute - JavaScript code in String to parse and execute
 * @param {any} sandbox - The variables and all the information required by program
 */
function execute(jsToExecute, sandbox) {
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
function render(abellTemplate, sandbox) {
  const {matches, input} = execRegexOnAll(/{{(.*?)}}/gs, abellTemplate) // Finds all the JS expressions to be executed.
  let renderedHTML = ''; 
  let lastIndex = 0;
  
  for(let match of matches) { // Loops Through all the JS expressions 
    const value = execute(match[1], sandbox); // Executes the expression value in the sandbox environment
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