const {
  execute,
  executeRequireStatement
} = require('./execute.js');

/**
 * Captures groups from regex and executes RegEx.exec() function on all.
 * 
 * @param {regex} regex - Regular Expression to execute on.
 * @param {string} template - HTML Template in string.
 * @return {object} sandbox
 * sandbox.matches - all matches of regex
 * sandbox.input - input string
 */
const execRegexOnAll = (regex, template) => {
  /** allMatches holds all the results of RegExp.exec() */
  const allMatches = [];
  let match = regex.exec(template); 
  if (!match) {
    return {matches: [], input: template};
  }

  const {input} = match; 

  while (match !== null) {
    delete match.input;
    allMatches.push(match);
    match = regex.exec(template);
  }


  return {matches: allMatches, input};
};


/**
 * Outputs vanilla html string when abell template and sandbox is passed.
 * 
 * @param {string} abellTemplate - String of Abell File.
 * @param {any} sandbox 
 * Object of variables. The template will be executed in context of this sandbox.
 * @param {object} options additional options e.g ({basePath})
 * @return {string} htmlTemplate
 */
function render(abellTemplate, sandbox, options = {basePath: ''}) {
  // Finds all the JS expressions to be executed.
  const {matches, input} = execRegexOnAll(/{{(.*?)}}/gs, abellTemplate); 
  let renderedHTML = ''; 
  let lastIndex = 0;
  
  for (const match of matches) { // Loops Through JavaScript blocks inside '{{' and '}}'
    let value = '';
    if (match[1].includes('require(')) {
      // the js block is trying to require (e.g const module1 = require('module1'))
      const lines = match[1]
        .trim()
        .split(/[\n;]/)
        .filter(list => list !== '');

      for (const line of lines) {
        // If line does not include require(), execute it as assignment
        if (!line.includes('require(')) {
          ({sandbox} = execute(line, sandbox));
          continue;
        }

        sandbox = executeRequireStatement(line, sandbox, options.basePath);
      }
    } else {
      // Executes the expression value in the sandbox environment
      const executionInfo = execute(match[1], sandbox); 
      if (executionInfo.type === 'assignment') {
        sandbox = executionInfo.sandbox;
      } else if (executionInfo.type === 'value') {
        value = executionInfo.value;
      } else {
        sandbox = executionInfo.sandbox;
      }
    }


    /**
     * Removes the JavaScript line before adding to HTML 
     * if the script returns value, adds it to the HTML
     */ 
    const toAddOnIndex = match.index; // Gets the index where the executed value is to be put.
    renderedHTML += input.slice(lastIndex, toAddOnIndex) + value; 
    lastIndex = toAddOnIndex + match[0].length; 
  }

  renderedHTML += input.slice(lastIndex);
  return renderedHTML;
}


module.exports = {
  render,
  execute
};
