const fs = require('fs');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const cheerio = require('cheerio');

/**
 * Creates basic tests
 * @param {Array} TEST_MAP map of test queries and equalto values
 * @param {Object} options
 * @param {String} options.outPath - out.html path
 * @param {String} options.exampleToRun - Name of the folder in example to run
 */
function equalValueChecks(TEST_MAP, { outPath, exampleToRun }) {
  let htmlTemplate;
  let $;

  beforeAll(async () => {
    const { stderr } = await exec('npm run example ' + exampleToRun);
    if (stderr) {
      throw stderr;
    }

    htmlTemplate = fs.readFileSync(outPath, 'utf-8');
    $ = cheerio.load(htmlTemplate);
  });

  for (const test of TEST_MAP) {
    it(test.desc, () => {
      expect($(test.query).html()).toMatchSnapshot();
    });
  }
}

module.exports = { equalValueChecks };
