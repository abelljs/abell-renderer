const stylis = require('stylis');
const generateScopedSelector = require('./selector');

const ABELL_CSS_DATA_PREFIX = 'data-abell';

const selectorPrefixer = (hash) => (element) => {
  // rule is the AST node which has the css selector
  if (element.type === 'rule') {
    const newSelectors = element.props.map((selector) => {
      return generateScopedSelector(
        selector,
        `${ABELL_CSS_DATA_PREFIX}-${hash}`
      );
    });
    element.props = newSelectors;
  }
};

const cssSerializer = (cssString, hash) => {
  return stylis.serialize(
    stylis.compile(cssString),
    stylis.middleware([selectorPrefixer(hash), stylis.stringify])
  );
};

module.exports = cssSerializer;
