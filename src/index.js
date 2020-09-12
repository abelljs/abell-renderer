const { getAbellInBuiltSandbox } = require('./utils.js');
const { compile } = require('./compiler.js');

/**
 * Outputs vanilla html string when abell template and sandbox is passed.
 *
 * @param {String} abellTemplate - String of Abell File.
 * @param {Object} userSandbox
 * Object of variables. The template will be executed in context of this sandbox.
 * @param {Object} options additional options e.g ({basePath})
 * @return {String|Object} htmlTemplate
 */
function render(abellTemplate, userSandbox = {}, options = {}) {
  const { builtInFunctions, components } = getAbellInBuiltSandbox(options);
  userSandbox = { ...userSandbox, ...builtInFunctions };
  const htmlOutput = compile(abellTemplate, userSandbox, options);
  if (options.allowComponents) {
    return { html: htmlOutput, components };
  }
  return htmlOutput;
}

// const abellCode = `
// {{
//   const Nav = require('Nav.abell');
//   const a = 3;
//   const b = 9;
//   let d = 9;
//   let e = 6;
// }}

// <body>
//   {{ Nav('hehe').renderedHTML }}
//   {{ a + b }}
//   {{
//     e = 3
//     d = 10
//   }}
//   {{
//     () => {
//       if (d === 0) {
//         return d
//       } else {
//         return 'Beep'
//       }
//     }
//   }}
//   {{ c }}
// </body>
// `;

// const startTime = new Date().getTime();
// console.log(
//   render(
//     abellCode,
//     { c: 'Hello' },
//     { allowRequire: true, filename: 'src/index.abell' }
//   )
// );
// console.log(new Date().getTime() - startTime);

module.exports = { render };
