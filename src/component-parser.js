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
 * @param {string} abellPath path of abell component file
 * @return {object}
 */
function parseComponent(abellPath) {
  return {};
}

module.exports = { parseComponent, parseAttributes, componentTagTranspiler };
