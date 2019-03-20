const xpath = require('xpath'), Dom = require('xmldom').DOMParser;

exports.xpathFromXmlString = function(xmlString, xpathExpression) {
    const doc = new Dom().parseFromString(xmlString);
    const result = xpath.evaluate(
        xpathExpression,
        doc,
        null,
        xpath.XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
        null);
    let node = result.iterateNext();
    let array = [];
    while (node) {
        if (node.textContent.length > 0)
            array.push(node.textContent);
        node = result.iterateNext();
    }
    return array;
};
