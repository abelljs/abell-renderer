const fs = require('fs');
const path = require('path');

const { execute } = require('./execute.js');

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
 *
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

/**
 * Outputs vanilla html string when abell template and sandbox is passed.
 *
 * @param {string} abellTemplate - String of Abell File.
 * @param {any} userSandbox
 * Object of variables. The template will be executed in context of this sandbox.
 * @param {object} options additional options e.g ({basePath})
 * @return {string} htmlTemplate
 */
function render(
  abellTemplate,
  userSandbox,
  options = { basePath: '', allowRequire: false }
) {
  let sandbox = {
    ...userSandbox,
    require: (pathToRequire) => abellRequire(pathToRequire, options),
    console: { log: console.log }
  };

  if (!options.allowRequire) {
    delete sandbox.require;
  }

  // Finds all the JS expressions to be executed.
  const { matches, input } = execRegexOnAll(/\\?{{(.+?)}}/gs, abellTemplate);
  let renderedHTML = '';
  let lastIndex = 0;

  for (const match of matches) {
    // Loops Through JavaScript blocks inside '{{' and '}}'
    let value = '';
    if (match[0].startsWith('\\{{')) {
      // Ignore the match that starts with slash '\' and return the same value without slash
      value = match[0].slice(1);
    } else if (match[1].match(/} ?=/g) !== null) {
      // Condition to check if the block has destructuring

      // destructured elements need to be executed line by line.
      const lines = match[1]
        .trim()
        .split(/[\n;]/)
        .filter((line) => line.trim() !== '');

      for (const line of lines) {
        ({ sandbox } = execute(line, sandbox));
      }
    } else {
      // Executes the block directly
      const executionInfo = execute(match[1], sandbox);
      if (executionInfo.type === 'assignment') {
        sandbox = executionInfo.sandbox;
      } else if (executionInfo.type === 'value') {
        value = executionInfo.value;
      } else {
        sandbox = executionInfo.sandbox;
      }
    }

    /**
     * Removes the JavaScript line before adding to HTML
     * if the script returns value, adds it to the HTML
     */

    const toAddOnIndex = match.index; // Gets the index where the executed value is to be put.
    renderedHTML += input.slice(lastIndex, toAddOnIndex) + String(value).trim();
    lastIndex = toAddOnIndex + match[0].length;
  }

  renderedHTML += input.slice(lastIndex);
  return renderedHTML;
}

/**
 * Creates Express engine with given options
 * @param {object} options
 * @param {Boolean} options.allowRequire
 * @return {Function}
 */
function engine({ allowRequire } = { allowRequire: false }) {
  return (filePath, options, callback) => {
    // define the template engine
    const content = fs.readFileSync(filePath);
    const rendered = render(content, options, {
      basePath: path.dirname(filePath),
      allowRequire
    });
    return callback(null, rendered);
  };
}

module.exports = {
  render,
  execute,
  engine
};
