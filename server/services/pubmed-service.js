const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const getArticleId = async function (articleId) {
    return await dbConnector.query(`SELECT * FROM pubmed_article where pubmed_id = '${articleId}'`);
};

const isArticleFromDisease = async function (articleId, diseaseId) {
    return await dbConnector.query(`SELECT * FROM pubmed_article pa INNER JOIN pubmed_article_dbpedia_disease padd on pa.id = padd.pubmed_article_id WHERE pa.id = ${articleId} AND padd.dbpedia_disease_id = ${diseaseId}`);
};

const updateArticleData = async function(title, abstract, articleId) {
    return await dbConnector.query(`UPDATE pubmed_article SET  title = '${title}', abstract = '${abstract}', updated_at = current_timestamp WHERE id = ${articleId}`);
};

const saveArticleToDb = async function (articleId, title, abstract, diseaseId) {
    const article = await getArticleId(articleId);
    const exists = !!article[0];
    abstract = stringUtils.sanitize(abstract);
    title = stringUtils.sanitize(title);
    if (!exists) {
        const queryResult = await dbConnector.query(`INSERT INTO pubmed_article(pubmed_id, title, abstract) VALUES (${articleId}, '${title}', '${abstract}')`);
        const pubmedArticleId = queryResult.insertId;
        await dbConnector.query(`INSERT INTO pubmed_article_dbpedia_disease(pubmed_article_id, dbpedia_disease_id) VALUES (${pubmedArticleId}, ${diseaseId})`);
    } else {
        const id = article[0].id;
        const articleFromDisease = await isArticleFromDisease(id, diseaseId);
        const isFromDisease = !!articleFromDisease[0];
        if (isFromDisease) {
            const existingTitle = article[0].title;
            const existingAbstract = article[0].abstract;
            const isTitleTheSame = stringUtils.areStringsTheSame(title, existingTitle);
            const isAbstractTheSame = stringUtils.areStringsTheSame(abstract, existingAbstract);
            if (!isTitleTheSame || !isAbstractTheSame) {
                console.log('updating info');
                await updateArticleData(existingTitle, existingAbstract, id);
            }
        } else {
            await dbConnector.query(`INSERT INTO pubmed_article_dbpedia_disease(pubmed_article_id, dbpedia_disease_id) VALUES (${id}, ${diseaseId})`);
        }
    }
};

module.exports = {
    saveArticleToDb: saveArticleToDb
};
