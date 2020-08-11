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
 * @param {String} abellTemplate - String of Abell File.
 * @param {Object} userSandbox
 * Object of variables. The template will be executed in context of this sandbox.
 * @param {Object} options additional options e.g ({basePath})
 * @return {String|Object} htmlTemplate
 */
function render(
  abellTemplate,
  userSandbox,
  options = {
    basePath: '',
    allowRequire: false,
    allowComponents: false,
    filename: '.abell'
  }
) {
  options.basePath = options.basePath || '';
  options.allowRequire = options.allowRequire || false;
  options.allowComponents = options.allowComponents || false;
  options.filename = options.filename || '.abell';

  const components = [];
  const sandbox = {
    ...userSandbox,
    require: (pathToRequire) => {
      if (pathToRequire.endsWith('.abell')) {
        if (options.allowComponents) {
          return (props) => {
            const component = parseComponent(
              path.join(options.basePath, pathToRequire),
              props,
              options
            );
            components.push(component);
            return component;
          };
        } else {
          return;
        }
      }

      return abellRequire(pathToRequire, options);
    },
    console: { log: console.log }
  };

  // delete require function if allow require is false
  if (!options.allowRequire) {
    delete sandbox.require;
  }

  if (options.allowComponents) {
    abellTemplate = parseComponentTags(abellTemplate);
  }
  const compiledAbell = compile(abellTemplate, sandbox, options);
  if (options.allowComponents) {
    return {
      html: compiledAbell,
      components
    };
  }

  return compiledAbell;
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
