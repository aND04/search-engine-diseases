const sanitize = function (string) {
    string = string.toString().replace(/\\n|['"]/g, '');
    return string.replace(/\s{2,}/g, ' ');
};

module.exports = {
    sanitize: sanitize
};