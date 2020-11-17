const fs = require('fs');
const path = require('path');

const { buildAndGetSelector } = require('../../tests/utils/baseTestFramework');

describe('examples/read-file', () => {
  beforeAll(async () => {
    await buildAndGetSelector({
      exampleToRun: 'read-file',
      outPath: path.join(__dirname, 'out.html')
    });
  });

  it('should render csv data in out.html', () => {
    expect(
      fs.readFileSync(path.join(__dirname, 'out.html'), 'utf-8').trim()
    ).toEqual('hi, hello, nice\nhaha, woop, lol');
  });
});
