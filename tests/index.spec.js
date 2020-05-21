const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;

const {
  execute,
  executeRequireStatement
} = require('../src/execute.js');

const abellRenderer = require('../src/index.js');

describe('render() - renders abellTemplate into HTML Text', () => {
  it('should output given htmlTemplate on given abellTemplate', () => {
    const abellTemplate = fs.readFileSync(
      path.join(__dirname, 'resources', 'if-input.abell'), 
      'utf-8'
    );

    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, 'resources', 'should-output.html'), 
      'utf-8'
    );

    const sampleSandbox = {
      $contentList: [
        {name: 'Nice'},
        {name: 'very cool'}
      ]
    };

    expect(
      abellRenderer
        .render(
          abellTemplate, 
          sampleSandbox, 
          {basePath: path.join(__dirname, 'resources')}
        )
    ).to.equal(htmlTemplate);
  });

  it('should execute w/o error and return same string if template has no JS', () => {
    expect(
      abellRenderer.render(
        'hi there this template does not have JS',
        {test: 'test'}
      )
    ).to.exist.and.to.equal('hi there this template does not have JS');
  });

  it('should return 7 when a function returning 3 + 4 is passed', () => {
    expect(
      abellRenderer.render(
        '{{add}}',
        {add: (() => 3 + 4)()}
      )
    ).to.equal('7');
  });

  it('should return "TEST" if "test".toUpperCase() is renderer ', () => {
    expect(
      abellRenderer.render(
        '{{"test".toUpperCase()}}',
        {}
      )
    ).to.equal('TEST');
  });

  it('should handle multiple assignments and requires in same block', () => {
    const abellTemplate = `
      {{
        const a = 3;
        const b = 5;
        const path = require('path');
        const hiHelloPath = require('path').join('hi', 'hello');
      }}
      <div>{{ a + b }} {{ path.join('hi', 'hello') }} {{ hiHelloPath }}</div>
    `;

    expect(
      abellRenderer.render(
        abellTemplate,
        {}
      ).trim()
    ).to.equal('<div>8 hi/hello hi/hello</div>');
  });

  it('should not throw error and return same value if blank brackets passed', () => {
    expect(
      abellRenderer.render(
        '{{}}',
        {}
      )
    ).to.equal('{{}}');
  });

  it('should ignore the brackets when slash is added before the bracket', () => {
    expect(
      abellRenderer.render(
        '\\{{ This is ignored }}',
        {}
      )
    ).to.equal('{{ This is ignored }}');
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

  it('should handle the case of require(\'module\').property', () => {
    expect(
      executeRequireStatement('const testPath = require(\'path\').join(\'test\',\'path\')')
        .testPath
    ).to.equal(path.join('test', 'path'));
  });
});
