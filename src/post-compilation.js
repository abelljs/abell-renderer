const { ABELL_CSS_DATA_PREFIX } = require('./parsers/css');

// This function uses a single regular expression to add a data prefix to every html opening tag passed to it
const prefixHtmlTags = (htmlString, hash) => {
  const openingTagRegexp = /\<([a-zA-Z]+)(.*?)(\s?\/?)\>/gs;
  return htmlString.replace(
    openingTagRegexp,
    `<$1$2 ${ABELL_CSS_DATA_PREFIX}-${hash}$3>`
  );
};

exports.prefixHtmlTags = prefixHtmlTags;
