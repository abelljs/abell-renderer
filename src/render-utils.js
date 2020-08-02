const fs = require('fs');
const path = require('path');

/**
 * Clean Error
 * @param {String} errorStack
 * @return {String}
 */
function cleanErrorStack(errorStack) {
  const stackLines = errorStack.split('\n');
  const removeAbellVariable = stackLines[1]
    .replace('aBellSpecificVariable =', '')
    .trim();

  const newError = [
    `${removeAbellVariable ? removeAbellVariable : ''}`,
    stackLines[4]
  ];

  return newError.filter((errLine) => !!errLine).join('\n');
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
 * Wraps the nodejs require to add some additional functionality of Abell
 * @param {String} pathToRequire Path to the file that you want to require
 * @param {Object} options
 * @return {String}
 */
function abellRequire(pathToRequire, options) {
  if (options.basePath === undefined) {
    options.basePath = '';
  }

  try {
    const fullPathToRequire = path.join(options.basePath, pathToRequire);
    if (fs.existsSync(fullPathToRequire)) {
      // Local file require
      return require(fullPathToRequire);
    }

    // NPM Package or NodeJS Module
    return require(pathToRequire);
  } catch (err) {
    const positionOfAbellFileInStack = err.stack.indexOf(
      '\nat ' + options.filename
    );

    if (err.code === 'MODULE_NOT_FOUND') {
      const moduleName = path.join(
        path.dirname(options.filename),
        err.message.match(/'(.*?)'/)[1]
      );

      console.log(`\n\nError: Cannot find module '${moduleName}'`);
    } else {
      console.log(`\n\nError: ${err.message}`);
    }

    console.log(
      `     ` +
        err.stack.slice(
          positionOfAbellFileInStack,
          err.stack.indexOf('\n', positionOfAbellFileInStack)
        )
    );

    console.log('\nStack:');
    throw err;
  }
}

module.exports = { execRegexOnAll, abellRequire, cleanErrorStack };
