const path = require('path');
const {
  buildAndGetSelector
} = require('../../tests/utils/baseTestFramework.js');

// all the contents are managed by a jest snapshot internally
const TEST_MAP = [
  {
    desc: 'should render content of Nav Component',
    query: '[data-test="nav-component"]'
  },
  {
    desc: 'should render content of Footer Component',
    query: '[data-test="footer-component"]'
  },
  {
    desc: 'should render main content',
    query: '[data-test="main-content"]'
  }
];

describe('examples/with-components', () => {
  let $;
  beforeAll(async () => {
    $ = await buildAndGetSelector({
      exampleToRun: 'with-components',
      outPath: path.join(__dirname, 'out.html')
    });
  });

  for (const test of TEST_MAP) {
    it(test.desc, () => {
      expect($(test.query).html()).toMatchSnapshot();
    });
  }
});
