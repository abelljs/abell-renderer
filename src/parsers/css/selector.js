const selectorParser = require('postcss-selector-parser');

// mostly taken from https://github.com/vuejs/component-compiler-utils/blob/master/lib/stylePlugins/scoped.ts
// Removed some vue specific features
const cssSelectorTransformer = (scopingAttribute) => {
  return selectorParser((selectors) => {
    selectors.each((selector) => {
      let node = null;

      // find the last child node to insert attribute selector
      selector.each((n) => {
        if (n.type !== 'pseudo' && n.type !== 'combinator') {
          node = n;
        }
      });

      if (node) {
        node.spaces.after = '';
      } else {
        // For deep selectors & standalone pseudo selectors,
        // the attribute selectors are prepended rather than appended.
        // So all leading spaces must be eliminated to avoid problems.
        selector.first.spaces.before = '';
      }

      selector.insertAfter(
        node,
        selectorParser.attribute({
          attribute: scopingAttribute
        })
      );
    });
  });
};

const generateScopedSelector = (selector, attribute) =>
  cssSelectorTransformer(attribute).processSync(selector);

module.exports = generateScopedSelector;
