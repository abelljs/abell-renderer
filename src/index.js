const fs = require('fs');
const path = require('path');
const { compile } = require('./compiler.js');
const { parseComponent } = require('./parsers/component-parser.js');
const {
  getAbellInBuiltSandbox,
  getAbellComponentTemplate
} = require('./utils/general-utils.js');

/**
 *
 * @typedef RenderedObject
 * @property {string} html
 * @property {Array} components
 *
 * @typedef RenderOptions
 * @property {string} basePath
 * @property {string} filename
 * @property {boolean} allowRequire
 * @property {boolean} allowComponents
 *
 */

/**
 * Outputs vanilla html string when abell template and sandbox is passed.
 *
 * @param {String} abellTemplate - String of Abell File.
 * @param {Object} userSandbox
 * Object of variables. The template will be executed in context of this sandbox.
 * @param {RenderOptions} options additional options.
 * @return {String|RenderedObject} htmlTemplate
 */
function render(abellTemplate, userSandbox = {}, options = {}) {
  options.basePath =
    options.basePath ||
    (options.filename && path.dirname(options.filename)) ||
    '';

  options.allowRequire = options.allowRequire || false;
  options.allowComponents = options.allowComponents || false;
  options.filename = options.filename || '<undefined>.abell';

  const components = [];
  const transformations = {
    '.abell': (pathToRequire) => {
      const abellComponentContent = getAbellComponentTemplate(
        path.join(options.basePath, pathToRequire),
        'utf-8'
      );

      return (props) => {
        const parsedComponent = parseComponent(
          abellComponentContent,
          path.join(options.basePath, pathToRequire),
          props,
          options
        );
        components.push(parsedComponent);
        return parsedComponent;
      };
    }
  };

  const builtInFunctions = getAbellInBuiltSandbox(options, transformations);
  userSandbox = { ...userSandbox, ...builtInFunctions };

  const htmlOutput = compile(abellTemplate, userSandbox, options);
  if (options.allowComponents) {
    return { html: htmlOutput, components };
  }
  return htmlOutput;
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

module.exports = { render, engine };
