var db = require('./dbConnection');

/** Model with the metadata queries. */
var Metadata = {
    /** For a given disease get the metadata. */
    getMetadata: function (req, result) {
        var sql = "SELECT meta.wikipageId, meta.uri, meta.image, meta.comment " +
            "FROM dbpedia_disease disease, dbpedia_metadata_disease meta " +
            "WHERE disease.description = '" + req.disease + "' " +
            "AND disease.id = meta.diseaseId ";

        db.query(sql, function (err, res) {
            if (err) {
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }
};

module.exports = Metadata;