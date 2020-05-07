const {
  execute,
  executeAssignment,
  executeRequire
} = require('./execute.js');

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
 * @param {object} options additional options e.g ({basePath})
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
  execute,
  executeAssignment
}