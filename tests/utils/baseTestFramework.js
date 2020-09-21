const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const cheerio = require('cheerio');

/**
 * Builds example and returns jQuery selector.
 * @param {object} options
 * @param {string} options.exampleToRun
 * @param {string} options.outPath
 */
async function buildAndGetSelector({ exampleToRun, outPath }) {
  const { stderr } = await exec('npm run example ' + exampleToRun);
  if (stderr) {
    throw stderr;
  }

  const htmlTemplate = fs.readFileSync(outPath, 'utf-8');
  $ = cheerio.load(htmlTemplate);
  return $;
}

module.exports = { buildAndGetSelector };
