const fs = require('fs');
const path = require('path');
const { ABELL_CSS_DATA_PREFIX } = require('../parsers/css-parser.js');

/**
 * @typedef {import('../index.js').RenderOptions} RenderOptions
 */

/**
 * Returns in-built functions from Abell
 * @param {RenderOptions} options
 * @param {object} transformations
 * @return {any}
 */
function getAbellInBuiltSandbox(options, transformations = {}) {
  const builtInFunctions = {
    console: {
      log: console.log
    },
    __filename: path.resolve(options.filename),
    __dirname: path.resolve(options.basePath)
  };

  if (options.allowRequire) {
    builtInFunctions.require = (pathToRequire) => {
      const fullRequirePath = path.join(options.basePath, pathToRequire);

      if (fullRequirePath.endsWith('.abell')) {
        return transformations['.abell'](pathToRequire);
      }

      if (fs.existsSync(fullRequirePath)) {
        // Local file require
        return require(fullRequirePath);
      }

      try {
        // NPM Package or NodeJS Module
        return require(pathToRequire);
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          throwCustomError(err);
        } else {
          throw err;
        }
      }
    };
  }

  return builtInFunctions;
}

/**
 * Checks if the given index comes inside Abell Block
 * @param {string} abellBlockText abell template
 * @param {number} index current position index
 * @return {boolean}
 */
function isInsideAbellBlock(abellBlockText, index) {
  const beforeIndexTemplate = abellBlockText.slice(0, index);
  const openBracketMatches = beforeIndexTemplate.match(/.?{{/gs);
  const openBracketCount = (openBracketMatches || []).length;
  const closeBracketCount = (beforeIndexTemplate.match(/}}/g) || []).length;
  return (
    openBracketCount > closeBracketCount &&
    !openBracketMatches[openBracketMatches.length - 1].startsWith('\\')
  );
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
  console.log(`${colors.yellow('>>')} ${errorMessage}`);
  if (filename) {
    console.log('\tat ' + filename);
  }
};

// copied from https://github.com/sindresorhus/slash/blob/master/index.js
/**
 * Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
 * @param {String} path  input path string
 * @return {String}
 */
const normalizePath = (path) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

  if (isExtendedLengthPath || hasNonAscii) {
    return path;
  }

  return path.replace(/\\/g, '/');
};

/**
 *
 * @param {Error} err
 * @param {string} code
 */
function throwCustomError(err, code = '') {
  console.log(code);
  const stack = err.stack.split('\n');
  const abellFileInStack = stack
    .filter((atFile) => atFile.includes('.abell:'))
    .join('\n');
  console.log(colors.red('> ') + abellFileInStack.trim().replace(/at /g, ''));
  console.log(
    `${colors.red('>>')} Error: ${err.message.slice(
      0,
      err.message.indexOf('\n')
    )}`
  );
  console.log(abellFileInStack);
  console.log('\n');
  const compileError = new Error('>> Abell Compiler Error. More logs above.');
  compileError.stack = compileError.stack.slice(
    0,
    compileError.stack.indexOf('\n')
  );
  throw compileError;
}

/**
 * Returns the content of the abell file
 * @param {string} filePath path of the file
 * @return {string}
 */
function getAbellComponentTemplate(filePath) {
  /**
   * TODO: Memoize the component reads
   */
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      const relativeFilePath = path.relative(process.cwd(), filePath);
      err.message = `Cannot find component '${relativeFilePath}'`;
      throwCustomError(err);
    } else {
      throw err;
    }
  }
}

// This function uses a single regular expression to add a data prefix to every html opening tag passed to it
const prefixHtmlTags = (htmlString, hash) => {
  const openingTagRegexp = /\<([a-zA-Z]+)(.*?)(\s?\/?)\>/gs;
  return htmlString.replace(
    openingTagRegexp,
    `<$1$2 ${ABELL_CSS_DATA_PREFIX}-${hash}$3>`
  );
};

const colors = {
  red: (message) => `\u001b[31m${message}\u001b[39m`,
  yellow: (message) => `\u001b[1m\u001b[33m${message}\u001b[39m\u001b[22m`
};

module.exports = {
  execRegexOnAll,
  getAbellInBuiltSandbox,
  isInsideAbellBlock,
  logWarning,
  normalizePath,
  getAbellComponentTemplate,
  prefixHtmlTags,
  colors
};
