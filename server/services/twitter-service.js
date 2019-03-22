const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const getTweetId = async function (tweetId) {
    return await dbConnector.query(`SELECT * FROM twitter_tweet where tweet_id = '${tweetId}'`);
};

const updateTweetDisease = async function (tweetId, diseaseId) {
    const disease_tweet = await dbConnector.query(`SELECT * from twitter_tweet_dbpedia_disease where twitter_tweet_id = ${tweetId} and dbpedia_disease_id = ${diseaseId}`);
    return !disease_tweet[0];
};

const saveTweetToDb = async function (tweetId, description, tweetDate, url, diseaseId) {
    const tweet = await getTweetId(tweetId);
    const exists = await !!tweet[0];
    if (!exists) {
        const sanitizedDescription = await stringUtils.sanitize(description);
        const encodedDescription = stringUtils.encodeBase64(sanitizedDescription);
        const queryResult = await dbConnector.query(`INSERT INTO twitter_tweet(tweet_id, url, description, tweet_date) VALUES ('${tweetId}', '${url}', '${encodedDescription}', '${tweetDate}')`);
        const insertedId = queryResult.insertId;
        await dbConnector.query(`INSERT INTO twitter_tweet_dbpedia_disease(twitter_tweet_id, dbpedia_disease_id) VALUES (${insertedId}, ${diseaseId})`);
    } else {
        const id = tweet[0].id;
        const update = await updateTweetDisease(id, diseaseId);
        if (update) {
            await dbConnector.query(`INSERT INTO twitter_tweet_dbpedia_disease(twitter_tweet_id, dbpedia_disease_id) VALUES (${id}, ${diseaseId})`);
        }
    }

};

module.exports = {
    saveTweetToDb: saveTweetToDb
};
