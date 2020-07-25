const path = require('path');
const expect = require('chai').expect;

const { render } = require('../src/index.js');

describe('render() - renders abellTemplate into HTML Text', () => {
  // eslint-disable-next-line max-len
  it('should execute w/o error and return same string if template has no JS', () => {
    expect(
      render('hi there this template does not have JS', {
        test: 'test'
      })
    ).to.exist.and.to.equal('hi there this template does not have JS');
  });

  it('should return 7 when a function returning 3 + 4 is passed', () => {
    expect(render('{{add}}', { add: (() => 3 + 4)() })).to.equal('7');
  });

  it('should return "TEST" if "test".toUpperCase() is renderer ', () => {
    expect(render('{{"test".toUpperCase()}}', {})).to.equal('TEST');
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

    expect(render(abellTemplate, {}, { allowRequire: true }).trim()).to.equal(
      `<div>8 hi${path.sep}hello hi${path.sep}hello</div>`
    );
  });

  // eslint-disable-next-line max-len
  it('should not throw error and return same value if blank brackets passed', () => {
    expect(render('{{}}', {})).to.equal('{{}}');
  });

  // eslint-disable-next-line max-len
  it('should ignore the brackets when slash is added before the bracket', () => {
    expect(render('\\{{ This is ignored }}', {})).to.equal(
      '{{ This is ignored }}'
    );
  });

  // eslint-disable-next-line max-len
  it('should not throw error and return null value if empty brackets is passed', () => {
    expect(render('{{ }}', {})).to.equal('');
  });

  // error handlers

  // eslint-disable-next-line max-len
  it('should throw an error if require() is used without allowRequire: true option', () => {
    const abellTemplate = `
      {{
        const path = require('path');
        const hiHelloPath = require('path').join('hi', 'hello');
      }}
      <div>{{ path.join('hi', 'hello') }} {{ hiHelloPath }}</div>
    `;

    expect(() => render(abellTemplate, {})).to.throw('require is not defined');
  });

  // eslint-disable-next-line max-len
  it('should throw error at execute when a variable is not defined', () => {
    expect(() => render('{{ IamUndefined }}', {})).to.throw(
      'IamUndefined is not defined'
    );

    // Check if error is thrown at given filename
    let errorStackFirstLine = '';
    try {
      render('{{ IamUndefined }}', {}, { filename: 'render.spec.abell' });
    } catch (err) {
      errorStackFirstLine = err.stack.split('at')[1];
    }
    expect(
      errorStackFirstLine.trim().startsWith('render.spec.abell:1')
    ).to.equal(true);
  });

  // eslint-disable-next-line max-len
  it('should be able to handle multiple destructuring assignments', () => {
    const abellTemplate = `
      {{
        const { a } = {a: 3};
        const {b} = {b: 9};
        const e = 10;
        const {c, d} = {c: 6, d:69};
      }}
      {{ a }} {{ b }} {{ c }} {{  d  }} {{ e }}
    `;

    expect(render(abellTemplate, {}).trim()).to.equal('3 9 6 69 10');
  });

  it('should handle the case when there is no space around brackets', () => {
    const abellTemplate = `{{a}}`;

    expect(render(abellTemplate, { a: 9 }).trim()).to.equal('9');
  });
});
