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

module.exports = {
    saveArticleToDb: saveArticleToDb
};
