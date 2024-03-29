const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const getArticleId = async function (articleId) {
    const queryResult = await dbConnector.query(`SELECT id FROM pubmed_article where pubmed_id = '${articleId}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const articleExistsForCurrentDisease = async function (articleId, diseaseId) {
    const queryResult = await dbConnector.query(`SELECT * FROM pubmed_article_dbpedia_disease WHERE pubmed_article_id = ${articleId} AND dbpedia_disease_id = ${diseaseId}`);
    return !!queryResult[0];
};

const createRelationshipToDisease = async function (articleId, diseaseId) {
    await dbConnector.query(`INSERT INTO pubmed_article_dbpedia_disease(pubmed_article_id, dbpedia_disease_id) VALUES (${articleId}, ${diseaseId})`);
};

const setUpdatedAtArticleValue = async function (articleId) {
    await dbConnector.query(`UPDATE pubmed_article SET updated_at = NOW() WHERE id = ${articleId}`);
};

const saveArticleToDb = async function (articleId, title, abstract, diseaseId) {
    const id = await getArticleId(articleId);
    if (id === -1) {
        const encodedAbstract = stringUtils.encodeBase64(stringUtils.sanitize(abstract));
        const encodedTitle = stringUtils.encodeBase64(stringUtils.sanitize(title));
        const queryResult = await dbConnector.query(`INSERT INTO pubmed_article(pubmed_id, title, abstract) VALUES (${articleId}, '${encodedTitle}', '${encodedAbstract}')`);
        const pubmedArticleId = queryResult.insertId;
        await createRelationshipToDisease(pubmedArticleId, diseaseId);
    } else if (articleExistsForCurrentDisease(id, diseaseId)) {
        await setUpdatedAtArticleValue(id);
    } else {
        await setUpdatedAtArticleValue(id);
        await createRelationshipToDisease(id, diseaseId);
    }
};

const getArticles = async function () {
    return await dbConnector.query(`SELECT id, title, abstract FROM pubmed_article`);
};

const getArticleDiseases = async function (articleId) {
    return await dbConnector.query(`SELECT id FROM dbpedia_disease INNER JOIN pubmed_article_dbpedia_disease padd ON dbpedia_disease.id = padd.dbpedia_disease_id WHERE padd.pubmed_article_id = ${articleId}`);
};

const mentionDoesNotExist = async function (articleId, diseaseId) {
    const queryResult = await dbConnector.query(`SELECT * FROM pubmed_article_dbpedia_disease_mentions WHERE dbpedia_disease_id = ${diseaseId} AND pubmed_article_id = ${articleId}`);
    return !queryResult[0];
};

const saveArticleDiseaseMention = async function (articleId, diseaseId) {
    await dbConnector.query(`INSERT INTO pubmed_article_dbpedia_disease_mentions(pubmed_article_id, dbpedia_disease_id) VALUES (${articleId}, ${diseaseId})`);
};

const incrementArticleDiseaseMentionCount = async function (articleId, diseaseId) {
    await dbConnector.query(`UPDATE pubmed_article_dbpedia_disease_mentions SET number_of_mentions = number_of_mentions + 1 WHERE pubmed_article_id = ${articleId} AND dbpedia_disease_id = ${diseaseId}`);
};

module.exports = {
    saveArticleToDb: saveArticleToDb,
    getArticles: getArticles,
    getArticleDiseases: getArticleDiseases,
    mentionDoesNotExist: mentionDoesNotExist,
    saveArticleDiseaseMention: saveArticleDiseaseMention,
    incrementArticleDiseaseMentionCount: incrementArticleDiseaseMentionCount
};
