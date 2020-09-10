const fs = require('fs');
const { getAbellInBuiltSandbox } = require('./utils.js');
const { compile } = require('./compiler.js');

/**
 * Turns <Nav props={hello: 'hi'}/> to {{ Nav({hello: 'hi}).renderedHTML }}
 */
function componentTagTranspiler() {}

/**
 * Parse string attributes to object
 * @param {string} attrString
 * @return {object}
 */
function parseAttributes(attrString) {
  return attrString
    .match(/(?:[^\s"']+|(["'])[^"]*\1)+/g)
    .reduce((prevObj, val) => {
      const firstEqual = val.indexOf('=');
      if (firstEqual < 0) {
        return {
          [val]: true
        };
      }
      const key = val.slice(0, firstEqual);
      let value = val.slice(firstEqual + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      return {
        ...prevObj,
        [key]: value
      };
    }, {});
}

/**
 * Turns Given Abell Component into JavaScript Component Tree
 * @param {string} abellComponentPath path of abell component file
 * @param {object} options
 * @return {object}
 */
function parseComponent(abellComponentPath, options) {
  /**
   * TODO: Memoize Abell Component file content
   */
  const abellComponentContent = fs.readFileSync(abellComponentPath, 'utf-8');
  if (!abellComponentContent.trim().startsWith('<AbellComponent')) {
    throw new Error( // eslint-disable-next-line max-len
      `Abell Component should be wrapped inside <AbellComponent></AbellComponent>. \n >> Error requiring ${abellComponentPath}\n`
    );
  }

  return (props) => {
    const sandbox = {
      props,
      ...getAbellInBuiltSandbox(options)
    };

    const htmlComponentContent = compile(abellComponentContent, sandbox, {
      filename: path.relative(process.cwd(), abellComponentPath)
    });

    console.log(htmlComponentContent);

    return {
      renderedHTML: `We have received ${sandbox.props}`
    };
  };
}

module.exports = { parseComponent, parseAttributes, componentTagTranspiler };
