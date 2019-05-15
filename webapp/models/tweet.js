var db = require('./dbConnection');

/** Model with the Twitter queries. */
var Twitter = {
    /** For a given disease get the top-n most recent tweets. */
    getTopNMostRecentTweets: function (result, callback) {
        var sql = "SELECT tweet.url, tweet.description, tweet.tweet_date " +
            "FROM dbpedia_disease disease, twitter_tweet_dbpedia_disease tweetD, " +
                "twitter_tweet tweet " +
            "WHERE disease.description = '"+ result.Disease +
            "' AND disease.id = tweetD.dbpedia_disease_id " +
            "AND tweet.id = tweetD.twitter_tweet_id " +
            "ORDER BY tweet.tweet_date DESC " +
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

module.exports = Twitter;