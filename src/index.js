/**
 * This file mostly deals with exporting the right functions to the user
 * ./render.js - has the code that gets executed on abellRenderer.render
 * ./execute.js - executes the JavaScript and handles all the edge cases.
 */

const fs = require('fs');
const path = require('path');

const execute = require('./execute.js');
const render = require('./render.js');

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
