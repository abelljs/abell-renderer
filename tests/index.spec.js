const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;

const {
  execute,
  executeRequireStatement
} = require('../src/execute.js');

const abellRenderer = require('../src/index.js');


const sampleSandbox = {
  $contentList: [
    {name: 'Nice'},
    {name: 'very cool'}
  ]
};

const abellTemplate = fs.readFileSync(
  path.join(__dirname, 'resources', 'if-input.abell'), 
  'utf-8'
);

const htmlTemplate = fs.readFileSync(
  path.join(__dirname, 'resources', 'should-output.html'), 
  'utf-8'
);

describe('render() - renders abellTemplate into HTML Text', () => {
  it('should output given htmlTemplate on given abellTemplate', () => {
    expect(
      abellRenderer
        .render(
          abellTemplate, 
          sampleSandbox, 
          {basePath: path.join(__dirname, 'resources')}
        )
    ).to.equal(htmlTemplate);
  });
});


describe('execute() - Executes JavaScript passed to it as string', () => {
  it('should output added value when addition is performed on two values', () => {
    expect(
      execute('24 + 12', {}).value
    ).to.equal(36);
  });

  it('should update value of a to new value', () => {
    expect(
      execute('a = 22 + 22', {a: 4}).sandbox.a
    ).to.equal(44);
  });

  it('should not update value that is inside string', () => {
    expect(
      execute('(() => \'a = b\')()').value
    ).to.equal('a = b');
  });
});


describe('executeRequireStatement() - executes the code with require() in its string', () => {
  it('should add path native object when required', () => {
    expect(
      executeRequireStatement('const path = require(\'path\')')
        .path.join('test', 'path')
    ).to.equal(path.join('test', 'path'));
  });
});
