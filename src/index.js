const vm = require('vm');

const sandbox = {
  $contentList: [
    {name: 'Nice'},
    {name: 'very cool'}
  ],
  output: ''
};


const template = `
output = $contentList
  .map(content => 
    \`<div>\${content.name}</div>\`
  )
  .join('\\n')
`

const script = new vm.Script(template);

const context = new vm.createContext(sandbox);
script.runInContext(context);

console.log(sandbox.output);
// outputs
// <div>Nice</div>
// <div>very cool</div>