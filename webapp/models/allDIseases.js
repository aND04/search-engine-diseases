var db = require('./dbConnection');
const countDiseases = function () {
    let queryResult = db.query("SELECT COUNT(description) as n from dbpedia_disease");
    return queryResult[0] ? queryResult[0].n : -1;
}
const getAllDiseases = function (req, callback) {
    console.log("req: " + req)
    let sql = "Select description from dbpedia_disease where description LIKE "+ "'" + req + "%';"
    db.query(sql, function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, res);
        }
    });
}

module.exports = {
    countDiseases: countDiseases,
    getAllDiseases: getAllDiseases
}
