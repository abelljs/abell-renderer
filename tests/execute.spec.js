const expect = require('chai').expect;

const { compile } = require('../src/compiler.js');

// eslint-disable-next-line max-len
describe('compile() - Executes JavaScript passed to it as string', () => {
  // eslint-disable-next-line max-len
  it('should output added value when addition is performed on two values', () => {
    expect(
      compile('{{ 24 + 12 }}', {}, { filename: 'execute.spec.js' })
    ).to.equal('36');
  });

  it('should update value of a to new value', () => {
    expect(
      compile(
        '{{ a = 22 + 22 }} {{ a }}',
        { a: 4 },
        {
          filename: 'execute.spec.js'
        }
      ).trim()
    ).to.equal('44');
  });

  it('should not update value that is inside string', () => {
    expect(
      compile("{{ (() => 'a = b')() }}", {}, { filename: 'execute.spec.js' })
    ).to.equal('a = b');
  });
});
