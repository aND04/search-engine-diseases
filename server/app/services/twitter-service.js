const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const getTweetId = async function (tweetId) {
    const queryResult = await dbConnector.query(`SELECT * FROM twitter_tweet where tweet_id = '${tweetId}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const tweetExistsForCurrentDisease = async function (tweetId, diseaseId) {
    const queryResult = await dbConnector.query(`SELECT * FROM twitter_tweet_dbpedia_disease WHERE twitter_tweet_id = ${tweetId} AND dbpedia_disease_id = ${diseaseId}`);
    return !!queryResult[0];
};

const createRelationshipToDisease = async function (tweetId, diseaseId) {
    await dbConnector.query(`INSERT INTO twitter_tweet_dbpedia_disease(twitter_tweet_id, dbpedia_disease_id) VALUES (${tweetId}, ${diseaseId})`);
};

const setUpdatedAtTweetValue = async function (tweetId) {
    await dbConnector.query(`UPDATE twitter_tweet SET updated_at = NOW() WHERE id = ${tweetId}`);
};

const saveTweetToDb = async function (tweetId, description, tweetDate, url, diseaseId) {
    const id = await getTweetId(tweetId);
    if (id === -1) {
        const sanitizedDescription = stringUtils.sanitize(description);
        const encodedDescription = stringUtils.encodeBase64(sanitizedDescription);
        const queryResult = await dbConnector.query(`INSERT INTO twitter_tweet(tweet_id, url, description, tweet_date) VALUES ('${tweetId}', '${url}', '${encodedDescription}', '${tweetDate}')`);
        const tweetInsertedId = queryResult.insertId;
        await createRelationshipToDisease(tweetInsertedId, diseaseId);
    } else if (tweetExistsForCurrentDisease(id, diseaseId)) {
        await setUpdatedAtTweetValue(id);
    } else {
        await setUpdatedAtTweetValue(id);
        await createRelationshipToDisease(id, diseaseId);
    }

};

module.exports = {
    saveTweetToDb: saveTweetToDb
};
