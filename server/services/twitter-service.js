const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const getTweetId = async function (tweetId) {
    const queryResult = await dbConnector.query(`SELECT id FROM twitter_tweet where tweet_id = '${tweetId}'`);
    return queryResult[0] ? queryResult[0].id : -1;

};

const saveTweetToDb = async function (tweetId, description, tweetDate, url, diseaseId) {
    const id = await getTweetId(tweetId);
    if (id === -1) {
        const sanitizedDescription = await stringUtils.sanitize(description);
        const queryResult = await dbConnector.query(`INSERT INTO twitter_tweet(tweet_id, url, description, tweet_date) VALUES ('${tweetId}', '${url}', '${sanitizedDescription}', '${tweetDate}')`);
        const insertedId = queryResult.insertId;
        await dbConnector.query(`INSERT INTO twitter_tweet_dbpedia_disease(twitter_tweet_id, dbpedia_disease_id) VALUES (${insertedId}, ${diseaseId})`);
    } else {
        await dbConnector.query(`INSERT INTO twitter_tweet_dbpedia_disease(twitter_tweet_id, dbpedia_disease_id) VALUES (${id}, ${diseaseId})`);
    }

};

module.exports = {
    saveTweetToDb: saveTweetToDb
};
