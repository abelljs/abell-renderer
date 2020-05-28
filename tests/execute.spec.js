const path = require('path');
const expect = require('chai').expect;

const { execute, executeRequireStatement } = require('../src/execute.js');

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

// eslint-disable-next-line max-len
describe('executeRequireStatement() - executes the code with require() in its string', () => {
  it('should add path native object when required', () => {
    expect(
      executeRequireStatement("const path = require('path')").path.join(
        'test',
        'path'
      )
    ).to.equal(path.join('test', 'path'));
  });

  it("should handle the case of require('module').property", () => {
    expect(
      executeRequireStatement(
        "const testPath = require('path').join('test','path')"
      ).testPath
    ).to.equal(path.join('test', 'path'));
  });
});
