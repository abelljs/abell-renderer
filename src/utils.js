const fs = require('fs');
const path = require('path');

/**
 * Returns in-built functions from Abell
 * @param {object} options
 * @param {string} options.basePath
 * @return {any}
 */
function getAbellInBuiltSandbox(options) {
  const builtInFunctions = {
    console: {
      log: console.log
    }
  };

  if (options.allowRequire) {
    builtInFunctions.require = (pathToRequire) => {
      if (pathToRequire.endsWith('.abell')) {
        return require('./component-parser.js').parseComponent(
          pathToRequire,
          options
        );
      }

      const fullRequirePath = path.join(
        options.basePath ||
          (options.filename && path.dirname(options.filename)) ||
          '',
        pathToRequire
      );
      if (fs.existsSync(fullRequirePath)) {
        // Local file require
        return require(fullRequirePath);
      }

      // NPM Package or NodeJS Module
      return require(pathToRequire);
    };
  }

  return builtInFunctions;
}

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

module.exports = { execRegexOnAll, getAbellInBuiltSandbox };
