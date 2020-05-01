const vm = require('vm');

const sandbox = {
  $contentList: [
    {
      name: 'Nice'
    },
    {
      name: 'very nice'
    }
  ],
  output: ''
};


const template = `output = $contentList.map(content => {
  return '<div>' + content.name + '</div>';
}).join('')`

const script = new vm.Script(template);

const context = new vm.createContext(sandbox);
script.runInContext(context);


console.log(sandbox);