const expect = require('chai').expect;

const execute = require('../src/execute.js');

// eslint-disable-next-line max-len
describe('execute() - Executes JavaScript passed to it as string', () => {
  // eslint-disable-next-line max-len
  it('should output added value when addition is performed on two values', () => {
    expect(execute('24 + 12', {}).value).to.equal(36);
  });

  it('should update value of a to new value', () => {
    expect(execute('a = 22 + 22', { a: 4 }).sandbox.a).to.equal(44);
  });

  it('should not update value that is inside string', () => {
    expect(execute("(() => 'a = b')()").value).to.equal('a = b');
  });
});
