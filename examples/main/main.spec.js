const path = require('path');
const {
  buildAndGetSelector
} = require('../../tests/utils/baseTestFramework.js');

const TEST_MAP = [
  {
    desc: 'should test javascript inside brackets',
    query: '[data-test="js-add-check"]'
  },
  {
    desc: 'should test if reassignment of variable is possible',
    query: '[data-test="reassignment-check"]'
  },
  {
    desc: 'should check if values can be required from json and js',
    query: '[data-test="require-check"]'
  },
  {
    desc: 'should test if putting slash before bracket prints content as it is',
    query: '[data-test="comment-check"]'
  },
  {
    desc: 'should test if projects are correctly rendered',
    query: '[data-test="projects-check"]'
  }
];

describe('examples/main', () => {
  let $;
  beforeAll(async () => {
    $ = await buildAndGetSelector({
      exampleToRun: 'main',
      outPath: path.join(__dirname, 'out.html')
    });
  });

  for (const test of TEST_MAP) {
    it(test.desc, () => {
      expect($(test.query).html()).toMatchSnapshot();
    });
  }
});
