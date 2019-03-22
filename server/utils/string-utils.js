const sanitize = function (string) {
    if (!string) return '';
    string = string.toString().replace(/\\n|['"]/g, '');
    return string.replace(/\s{2,}/g, ' ');
};

const encodeBase64 = function (string) {
    return Buffer.from(string).toString('base64');
};

const decodeBase64 = function (encodedString) {
    return Buffer.from(encodedString, 'base64').toString('utf8');
};

module.exports = {
    sanitize: sanitize,
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64
};
