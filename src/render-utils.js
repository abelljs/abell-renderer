const fs = require('fs');
const path = require('path');

/**
 * Captures groups from regex and executes RegEx.exec() function on all.
 *
 * @param {regex} regex - Regular Expression to execute on.
 * @param {string} template - HTML Template in string.
 * @return {object} sandbox
 * sandbox.matches - all matches of regex
 * sandbox.input - input string
 */
const execRegexOnAll = (regex, template) => {
  /** allMatches holds all the results of RegExp.exec() */
  const allMatches = [];
  let match = regex.exec(template);
  if (!match) {
    return { matches: [], input: template };
  }

  const { input } = match;

  while (match !== null) {
    delete match.input;
    allMatches.push(match);
    match = regex.exec(template);
  }

  return { matches: allMatches, input };
};

/**
 * Wraps the nodejs require to add some additional functionality of Abell
 * @param {String} pathToRequire Path to the file that you want to require
 * @param {Object} options
 * @return {String}
 */
function abellRequire(pathToRequire, options) {
  if (options.basePath === undefined) {
    options.basePath = '';
  }

  const fullPathToRequire = path.join(options.basePath, pathToRequire);
  if (fs.existsSync(fullPathToRequire)) {
    // Local file require
    return require(fullPathToRequire);
  }

  // NPM Package or NodeJS Module
  return require(pathToRequire);
}

module.exports = { execRegexOnAll, abellRequire };
