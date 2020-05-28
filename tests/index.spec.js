const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;

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
      $contentList: [{ name: 'Nice' }, { name: 'very cool' }]
    };

    expect(
      abellRenderer.render(abellTemplate, sampleSandbox, {
        basePath: path.join(__dirname, 'resources'),
        allowRequire: true
      })
    ).to.equal(htmlTemplate);
  });

  // eslint-disable-next-line max-len
  it('should execute w/o error and return same string if template has no JS', () => {
    expect(
      abellRenderer.render('hi there this template does not have JS', {
        test: 'test'
      })
    ).to.exist.and.to.equal('hi there this template does not have JS');
  });

  it('should return 7 when a function returning 3 + 4 is passed', () => {
    expect(abellRenderer.render('{{add}}', { add: (() => 3 + 4)() })).to.equal(
      '7'
    );
  });

  it('should return "TEST" if "test".toUpperCase() is renderer ', () => {
    expect(abellRenderer.render('{{"test".toUpperCase()}}', {})).to.equal(
      'TEST'
    );
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
      abellRenderer.render(abellTemplate, {}, { allowRequire: true }).trim()
    ).to.equal('<div>8 hi/hello hi/hello</div>');
  });

  // eslint-disable-next-line max-len
  it('should throw an error if require() is used without allowRequire: true option', () => {
    const abellTemplate = `
      {{
        const path = require('path');
        const hiHelloPath = require('path').join('hi', 'hello');
      }}
      <div>{{ path.join('hi', 'hello') }} {{ hiHelloPath }}</div>
    `;

    expect(() => abellRenderer.render(abellTemplate, {})).to.throw(
      'require() is not allowed in the script'
    );
  });

  // eslint-disable-next-line max-len
  it('should not throw error and return same value if blank brackets passed', () => {
    expect(abellRenderer.render('{{}}', {})).to.equal('{{}}');
  });

  // eslint-disable-next-line max-len
  it('should ignore the brackets when slash is added before the bracket', () => {
    expect(abellRenderer.render('\\{{ This is ignored }}', {})).to.equal(
      '{{ This is ignored }}'
    );
  });
});
