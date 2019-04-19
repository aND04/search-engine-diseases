const sanitize = function (string) {
    if (!string) return '';
    string = string.toString().replace(/\\n/g, '');
    string = string.toString().replace(/'/g, "''");
    return string.replace(/\s{2,}/g, ' ');
};

const encodeBase64 = function (string) {
    if (!string) return '';
    return Buffer.from(string).toString('base64');
};

const decodeBase64 = function (encodedString) {
    if (!encodedString) return '';
    return Buffer.from(encodedString, 'base64').toString('utf8');
};

const hashCode = function(str) {
    return str.toString().split('').reduce((prevHash, currVal) =>
        (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
};

const areStringsTheSame = function (str1, str2) {
    return hashCode(str1) === hashCode(str2);
};

const parseTSVtoArray = function (tsv) {
    let result = [];
    const lines = tsv.split('\n');
    for (const line of lines) {
        if (line.trim().length > 0) {
            result.push(line.split('\t')[2]);
        }
    }
    return result;
};

const toSentenceCase = function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

module.exports = {
    sanitize: sanitize,
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64,
    hashCode: hashCode,
    areStringsTheSame: areStringsTheSame,
    parseTSVtoArray: parseTSVtoArray,
    toSentenceCase: toSentenceCase
};
