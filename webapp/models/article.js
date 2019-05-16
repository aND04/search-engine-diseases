var db = require('./dbConnection');

/** Model with the article queries. */
var Article = {
    /** For a given disease get the top-n related articles. */
    getTopNRelatedArticles: function(req, result) {
        var sql = "SELECT DISTINCT pubA.pubmed_id, pubA.title, pubA.abstract, pubA.pub_Date " +
            "FROM dbpedia_disease disease, pubmed_article pubA, " +
            "pubmed_article_dbpedia_disease_mentions pubAD, relevance rel " +
            "WHERE disease.description = '" + req.disease + "' " +
            "AND disease.id = pubAD.dbpedia_disease_id " +
            "AND pubAD.pubmed_article_id = pubA.id " +
            "AND rel.pubmed_article_id = pubA.id " +
            "ORDER BY rel.relevance_Avg DESC " +
            "LIMIT " + req.topN;

        db.query(sql, function (err, res) {
            if (err) {
                result(err, null);
            } else {
                result(null, res);
            }
        });
    },
    increaseExpFeed: function(req, result){
        let sqlQuery = "select PADD.pubmed_article_id as a_id, PADD.dbpedia_disease_id as d_id from dbpedia_disease dd, pubmed_article PA, pubmed_article_dbpedia_disease_mentions PADD where dd.description=" + "'" + req.diseaseN + "' and  PA.pubmed_id="+req.pubmed+" AND PA.id = PADD.pubmed_article_id AND dd.id = PADD.dbpedia_disease_id";
        db.query(sqlQuery, function (err, res) {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                let artcile_id = res[0].a_id;
                let disease_id = res[0].d_id;
                let updateSql = "UPDATE relevance SET explicitFeedbackValue = explicitFeedbackValue + 1 where pubmed_article_id = " + artcile_id + " and dbpedia_disease_id=" + disease_id;
                db.query(updateSql, function (err, resp) {
                    if (err) {
                        console.log(err);
                        result(err, null);
                    } else {
                        let sqlPercentages = "SELECT * FROM weighted_average_percentages"
                        db.query(sqlPercentages, function(err, resposta){
                            if (err) {
                                console.log(err);
                                result(err, null);
                            } else {
                                let tfidfRelValue = resposta[0].tfidfPer;
                                let pubDateRelValue = resposta[0].pubDatePer;
                                let similarityRelValue = resposta[0].similarityPer;
                                let explicitFeedbackValue = resposta[0].explicitFeedbackPer;
                                let implicitFeedbackValue = resposta[0].implicitFeedbackPer;
                                let sqlUpdateAverage = "UPDATE relevance SET relevance_Avg = (tfidf * "+ tfidfRelValue+ ") + (similarity * "+ similarityRelValue + ") + (explicitFeedbackValue * " + explicitFeedbackValue +") + (implicitFeedbackValue * "
                                    + implicitFeedbackValue + ") + (date_Relevance * " + pubDateRelValue +") WHERE pubmed_article_id=" + artcile_id + " AND dbpedia_disease_id=" + disease_id;
                                db.query(sqlUpdateAverage, function (err, updateResp) {
                                    if (err) {
                                        console.log(err);
                                        result(err, null);
                                    }else{
                                        result(null, updateResp);
                                    }
                                })
                            }
                        });
                        //result(null, resp);
                    }
                })
                console.log("res: " + res[0].a_id);
                //result(null, res);
            }
        });

    },
    decreaseExpFeed: function(req, result) {
        let sqlQuery = "select PADD.pubmed_article_id as a_id, PADD.dbpedia_disease_id as d_id from dbpedia_disease dd, pubmed_article PA, pubmed_article_dbpedia_disease_mentions PADD where dd.description=" + "'" + req.diseaseN + "' and  PA.pubmed_id="+req.pubmed+" AND PA.id = PADD.pubmed_article_id AND dd.id = PADD.dbpedia_disease_id";
        db.query(sqlQuery, function (err, res) {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                let artcile_id = res[0].a_id;
                let disease_id = res[0].d_id;
                let updateSql = "UPDATE relevance SET explicitFeedbackValue = explicitFeedbackValue - 1 where pubmed_article_id = " + artcile_id + " and dbpedia_disease_id=" + disease_id;
                db.query(updateSql, function (err, resp) {
                    if (err) {
                        console.log(err);
                        result(err, null);
                    } else {
                        let sqlPercentages = "SELECT * FROM weighted_average_percentages"
                        db.query(sqlPercentages, function(err, resposta){
                            if (err) {
                                console.log(err);
                                result(err, null);
                            } else {
                                let tfidfRelValue = resposta[0].tfidfPer;
                                let pubDateRelValue = resposta[0].pubDatePer;
                                let similarityRelValue = resposta[0].similarityPer;
                                let explicitFeedbackValue = resposta[0].explicitFeedbackPer;
                                let implicitFeedbackValue = resposta[0].implicitFeedbackPer;
                                let sqlUpdateAverage = "UPDATE relevance SET relevance_Avg = (tfidf * "+ tfidfRelValue+ ") + (similarity * "+ similarityRelValue + ") + (explicitFeedbackValue * " + explicitFeedbackValue +") + (implicitFeedbackValue * "
                                    + implicitFeedbackValue + ") + (date_Relevance * " + pubDateRelValue +") WHERE pubmed_article_id=" + artcile_id + " AND dbpedia_disease_id=" + disease_id;
                                db.query(sqlUpdateAverage, function (err, updateResp) {
                                    if (err) {
                                        console.log(err);
                                        result(err, null);
                                    }else{
                                        result(null, updateResp);
                                    }
                                })
                            }
                        });
                        //result(null, resp);
                    }
                })
                console.log("res: " + res[0].a_id);
                //result(null, res);
            }
        });
    }
};

module.exports = Article;
