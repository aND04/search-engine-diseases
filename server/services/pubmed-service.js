const dbConnector = require('../db/db-connector');

const getArticleId = async function (articleId) {
    const queryResult = await dbConnector.query(`SELECT id FROM pubmed_article where pubmed_id = '${articleId}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const saveArticleToDb = async function (articleId, title, abstract, diseaseId) {
    const id = await getArticleId(articleId);
    if (id === -1) {
        abstract = abstract.toString().replace(/^[\w\-\s]+$/, '');
        const queryResult = await dbConnector.query(`INSERT INTO pubmed_article(pubmed_id, title, abstract) VALUES (${articleId}, '${title}', '${abstract}')`);
        const pubmedArticleId = queryResult[0].id;
        await dbConnector.query(`INSERT INTO pubmed_article_dbpedia_disease(pubmed_article_id, dbpedia_disease_id) VALUES (${pubmedArticleId}, ${diseaseId})`);
    } else {
        await dbConnector.query(`INSERT INTO pubmed_article_dbpedia_disease(pubmed_article_id, dbpedia_disease_id) VALUES (${id}, ${diseaseId})`);
    }
};

module.exports = {
    saveArticleToDb: saveArticleToDb
};
