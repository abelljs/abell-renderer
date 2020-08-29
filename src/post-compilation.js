const { ABELL_CSS_DATA_PREFIX } = require('./parsers/css');

const prefixHtmlTags = (htmlString, hash) => {
  const openingTagRegexp = /\<([a-zA-Z]+)(.*?)\>/gs;
  return htmlString.replace(
    openingTagRegexp,
    `<$1$2 ${ABELL_CSS_DATA_PREFIX}-${hash}>`
  );
};

exports.prefixHtmlTags = prefixHtmlTags;
