const vm = require('vm');

function execute(jsToExecute, sandbox) {
  const script = new vm.Script('output = ' + jsToExecute);

  const context = new vm.createContext(sandbox);
  script.runInContext(context);

  return sandbox.output;
}

// User's context

const execRegexOnAll = (regex, template) => {
  const allMatches = [];
  let match = regex.exec(template);
  const input = match['input'];

  while(match !== null){
    delete match['input'];
    allMatches.push(match);
    match = regex.exec(template);
  }

  return {matches: allMatches, input};
}


function render(abellTemplate, sandbox) {
  const {matches, input} = execRegexOnAll(/{{(.*?)}}/gs, abellTemplate)
  let renderedHTML = '';
  let lastIndex = 0;
  
  for(let match of matches) {
    const value = execute(match[1], sandbox);
    const toAddOnIndex = match['index'];
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