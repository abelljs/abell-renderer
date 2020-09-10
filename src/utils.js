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
      const fullRequirePath = path.join(
        options.basePath ||
          (options.filename && path.dirname(options.filename)) ||
          '',
        pathToRequire
      );

      if (fullRequirePath.endsWith('.abell')) {
        return require('./component-parser.js').parseComponent(
          fullRequirePath,
          options
        );
      }

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

/**
 * console.log for warnings, logs with warning styles
 * @param {String} errorMessage message to log
 * @param {string} filename name of the file and line numbers that throw error
 */
const logWarning = (errorMessage, filename = '') => {
  console.log(`\u001b[1m\u001b[33m>>\u001b[39m\u001b[22m ${errorMessage}`);
  if (filename) {
    console.log('\tat ' + filename);
  }
};

module.exports = { execRegexOnAll, getAbellInBuiltSandbox, logWarning };
