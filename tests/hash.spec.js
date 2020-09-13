const hash = require('../src/hash');
const { normalizePath } = require('../src/utils.js');
const path = require('path');
// Simple test for our hashing function
// Just to ensure we don't accidentally modify it
// The implementation is tested enough in styled components

describe('hash()', () => {
  it('returns a stable value', () => {
    expect(hash('harshit')).toMatchInlineSnapshot(`"fiOpbu"`);
    expect(hash('/path/to/somewhere')).toMatchInlineSnapshot(`"ksROjr"`);
    expect(hash('/path/to/somwhere/with&*.js')).toMatchInlineSnapshot(
      `"kWclQE"`
    );
  });

  it('returns a stable hash for a filepath with normalization', () => {
    const currentFilePathRelative = normalizePath(
      path.relative(process.cwd(), __filename)
    );
    expect(hash(currentFilePathRelative)).toMatchInlineSnapshot(`"dPuPTn"`);
  });
});
