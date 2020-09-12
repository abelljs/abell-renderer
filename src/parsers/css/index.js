const stylis = require('stylis');
const generateScopedSelector = require('./selector');

const ABELL_CSS_DATA_PREFIX = 'data-abell';

const selectorPrefixer = (hash) => (element) => {
  // rule is the AST node which has the css selector
  if (element.type === 'rule') {
    // map over each existing select and prefix it
    const newSelectors = element.props.map((selector) => {
      return generateScopedSelector(
        selector,
        `${ABELL_CSS_DATA_PREFIX}-${hash}`
      );
    });
    // Mutate the old ast node with the new selectors
    element.props = newSelectors;
  }
};

const cssSerializer = (cssString, hash) => {
  return stylis.serialize(
    stylis.compile(cssString),
    stylis.middleware([selectorPrefixer(hash), stylis.stringify])
  );
};

exports.cssSerializer = cssSerializer;
exports.ABELL_CSS_DATA_PREFIX = ABELL_CSS_DATA_PREFIX;
