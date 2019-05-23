var db = require('./dbConnection');

/** Model with the disease queries. */
var Disease = {
    /** For a given disease get the top-n related diseases. */
    getTopNRelatedDiseases: function (req, result) {
        var sql = "SELECT mentions.dbpedia_disease_id, disease2.description " +
            "FROM dbpedia_disease disease, pubmed_article article, " +
            "pubmed_article_dbpedia_disease_mentions mentions, " +
            "pubmed_article_dbpedia_disease artD, dbpedia_disease disease2 " +
            "WHERE disease.description = '" + req.disease + "' " +
            "AND disease.id = artD.dbpedia_disease_id " +
            "AND article.id = artD.pubmed_article_id " +
            "AND article.id = mentions.pubmed_article_id " +
            "AND disease.id != mentions.dbpedia_disease_id " +
            "AND mentions.dbpedia_disease_id = disease2.id " +
            "ORDER BY mentions.number_of_mentions DESC " +
            "LIMIT " + req.topN;

        db.query(sql, function (err, res) {
            if (err) {
                result(err, null);
            } else {
                result(null, res);
            }
        });
    },

    /** Get all the diseases in database that have articles. */
    getAllDiseases: function (req, result) {
        var sql = "SELECT DISTINCT disease.description " +
            "FROM dbpedia_disease disease, pubmed_article_dbpedia_disease pubD, " +
                "pubmed_article_dbpedia_disease_mentions mentions " +
            "WHERE disease.id = pubD.dbpedia_disease_id " +
            "AND disease.id = mentions.dbpedia_disease_id";

        db.query(sql, function (err, res) {
            if (err) {
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }
};

module.exports = Disease;
