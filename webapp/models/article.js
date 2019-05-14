var db = require('./dbConnection');

/** Model with the article queries. */
var Article = {
  /** For a given disease get the top-n related articles. */
  getTopNRelatedArticles: function(result, callback) {
    var sql = "SELECT DISTINCT pubA.pubmed_id, pubA.title, pubA.abstract, pubA.pub_Date " +
      "FROM dbpedia_disease disease, pubmed_article pubA, pubmed_article_dbpedia_disease pubAD, " +
        "relevance rel " +
      "WHERE disease.description = '"+ result.Disease +
      "' AND disease.id = pubAD.dbpedia_disease_id " +
      "AND pubAD.pubmed_article_id = pubA.id " +
      "AND rel.pubmed_article_id = pubA.id " +
      "ORDER BY rel.relevance_Avg DESC " +
      "LIMIT " + result.Topn;


    db.query(sql, function (err, res) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, res);
        }
    });
  }
};

module.exports = Article;
