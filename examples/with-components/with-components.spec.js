const path = require('path');
const { equalValueChecks } = require('../../tests/utils/baseTestFramework.js');

// all the contents are managed by a jest snapshot internally
const TEST_MAP = [
  {
    desc: 'should render content of Nav Component',
    query: '[data-test="nav-component"]'
  },
  {
    desc: 'should render content of Footer Component',
    query: '[data-test="footer-component"]',
    toEqual: ' This is my <b data-abell-fbrlim>Footer</b> hello'
  },
  {
    desc: 'should render main content',
    query: '[data-test="main-content"]'
  }
];

describe('examples/with-components', () => {
  equalValueChecks(TEST_MAP, {
    exampleToRun: 'with-components',
    outPath: path.join(__dirname, 'out.html')
  });
});
