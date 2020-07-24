/**
 * This file mostly deals with exporting the right functions to the user
 * ./render.js - has the code that gets executed on abellRenderer.render
 * ./execute.js - executes the JavaScript and handles all the edge cases.
 */

const fs = require('fs');
const path = require('path');

const execute = require('./execute.js');
const { compile } = require('./compiler.js');
const { abellRequire } = require('./render-utils.js');

const { parseComponent, parseComponentTags } = require('./component-parser.js');

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
  const sandbox = {
    ...userSandbox,
    require: (pathToRequire) => {
      if (pathToRequire.endsWith('.component.abell')) {
        return (props) =>
          parseComponent(path.join(options.basePath, pathToRequire), props);
      }
      return abellRequire(pathToRequire, options);
    },
    console: { log: console.log }
  };

  // delete require function if allow require is false
  if (!options.allowRequire) {
    delete sandbox.require;
  }

  abellTemplate = parseComponentTags(abellTemplate);

  return compile(abellTemplate, sandbox);
}

/**
 * Creates ExpressJS engine with given options
 * FOR SSR
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
