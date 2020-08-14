const path = require('path');
const { equalValueChecks } = require('../../tests/utils/baseTestFramework.js');

const TEST_MAP = [
  {
    desc: 'should render content of Nav Component',
    query: '[data-test="nav-component"]',
    toEqual: ' This is my Navbar 13 '
  },
  {
    desc: 'should render content of Footer Component',
    query: '[data-test="footer-component"]',
    toEqual: ' This is my Footer hello'
  },
  {
    desc: 'should render main content',
    query: '[data-test="main-content"]',
    toEqual: 'Content'
  }
];

describe('examples/with-components', () => {
  equalValueChecks(TEST_MAP, {
    exampleToRun: 'with-components',
    outPath: path.join(__dirname, 'out.html')
  });
});
