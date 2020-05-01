const vm = require('vm');

function execute(jsToExecute) {
  const sandbox = {
    $contentList: [
      {name: 'Nice'},
      {name: 'very cool'}
    ],
    meta: {
      title: 'hey',
    },
    output: ''
  };
  

  const script = new vm.Script('output = ' + jsToExecute);

  const context = new vm.createContext(sandbox);
  script.runInContext(context);

  return sandbox.output;
}


const template = `
$contentList
  .map(content => 
    \`<div>\${content.name}</div>\`
  )
  .join('\\n')
`

console.log(execute(template));
console.log(execute('meta.title'));
