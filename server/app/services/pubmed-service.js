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

const saveArticleToDb = async function (articleId, title, abstract, diseaseId, pubDate) {
    const id = await getArticleId(articleId);
    if (id === -1) {
        const encodedAbstract = stringUtils.encodeBase64(stringUtils.sanitize(abstract));
        const encodedTitle = stringUtils.encodeBase64(stringUtils.sanitize(title));
        const queryResult = await dbConnector.query(`INSERT INTO pubmed_article(pubmed_id, title, abstract, pub_Date) VALUES ('${articleId}', '${encodedTitle}', '${encodedAbstract}', '${pubDate}')`);
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

const relevanceDoesNotExists = async function (articleId, diseaseId) {
    const queryResult = await dbConnector.query(`SELECT * FROM relevance WHERE dbpedia_disease_id = ${diseaseId} AND pubmed_article_id = ${articleId}`);
    return !queryResult[0];
};

const saveArticleDiseaseMention = async function (articleId, diseaseId, doidDisease) {
    await dbConnector.query(`INSERT INTO pubmed_article_dbpedia_disease_mentions(pubmed_article_id, dbpedia_disease_id, doidDisease) VALUES (${articleId}, ${diseaseId}, ${doidDisease})`);
};


const incrementArticleDiseaseMentionCount = async function (articleId, diseaseId) {
    await dbConnector.query(`UPDATE pubmed_article_dbpedia_disease_mentions SET number_of_mentions = number_of_mentions + 1 WHERE pubmed_article_id = ${articleId} AND dbpedia_disease_id = ${diseaseId}`);
};


const getNumberOfMentionsBoth = async function(articleId, diseaseId) {
    let query = await dbConnector.query(`SELECT number_of_mentions from pubmed_article_dbpedia_disease_mentions WHERE dbpedia_disease_id = ${diseaseId} AND pubmed_article_id = ${articleId}`);
    return query[0] ? query[0].number_of_mentions: -1;
};

const getNumberOfMentionsDisease = async function(articleId) {
    let query = await dbConnector.query(`SELECT SUM(number_of_mentions) as soma from pubmed_article_dbpedia_disease_mentions WHERE pubmed_article_id = ${articleId} GROUP BY pubmed_article_id`);
    return query[0] ? query[0].soma : -1;
};

const getNumberArticlesWithDisease = async function(diseaseId) {
    let query = await dbConnector.query(`SELECT COUNT(pubmed_article_id) as number from pubmed_article_dbpedia_disease_mentions WHERE dbpedia_disease_id = ${diseaseId}`);
    return query[0] ? query[0].number : -1;
};

const getCountOfDiseasesInArticle = async function(articleId) {
    let query = await dbConnector.query(`SELECT COUNT(dbpedia_disease_id) as NumberOfDiseases from pubmed_article_dbpedia_disease_mentions WHERE pubmed_article_id = ${articleId}`);
    return query[0] ? query[0].NumberOfDiseases: -1;
};

const getArticleDiseasesinMentionsTable = async function (articleId) {
    return await dbConnector.query(`SELECT dbpedia_disease_id FROM pubmed_article_dbpedia_disease_mentions WHERE pubmed_article_id = ${articleId} `);
};

const getNumberArticlesinMentionsTable = async function () {
    let query = await dbConnector.query(`SELECT COUNT(DISTINCT id) as articlesNr FROM pubmed_article`);
    return query[0] ? query[0].articlesNr : -1;
};

const getDoidNumberDisease = async  function(diseaseId){
    const query = await dbConnector.query(`select distinct doidDisease from pubmed_article_dbpedia_disease_mentions where dbpedia_disease_id = ${diseaseId}`);
    return query[0] ? query[0].doidDisease: -1;
};


const getInitialId = async  function(articleId){
    return dbConnector.query(`select dd.description, padd.dbpedia_disease_id from pubmed_article_dbpedia_disease padd, dbpedia_disease dd where pubmed_article_id=${articleId} and padd.dbpedia_disease_id = dd.id;`);
};

const getPubDateArticle = async function(articleId){
    return dbConnector.query(`SELECT pub_Date FROM pubmed_article WHERE id = ${articleId}`);
};


const saveArticleDiseaseRelevance = async function (articleId, diseaseId, tfidf, similarity, explicitFeedbackValue, implicitFeedbackValue, pubdate) {
    await dbConnector.query(`INSERT INTO relevance(pubmed_article_id, dbpedia_disease_id, tfidf, similarity, explicitFeedbackValue, implicitFeedbackValue, date_Relevance) VALUES (${articleId}, ${diseaseId}, ${tfidf}, ${similarity}, ${explicitFeedbackValue}, ${implicitFeedbackValue}, ${pubdate})`);
};

const updateArticleDiseaseRelevance = async function(articleId, diseaseId, tfidf, explicitFeedbackValue, implicitFeedbackValue){
    await  dbConnector.query(`UPDATE relevance SET tfidf=${tfidf}, explicitFeedbackValue = ${explicitFeedbackValue}, implicitFeedbackValue = ${implicitFeedbackValue} WHERE pubmed_article_id=${articleId} AND dbpedia_disease_id = ${diseaseId}`);
};

const insertPercentages = async function(tfidfPer, pubDatePer, similarityPer, explicitFeedbackPer, implicitFeedbackPer) {
    await dbConnector.query(`INSERT INTO weighted_average_percentages(tfidfPer, pubDatePer, similarityPer, explicitFeedbackPer, implicitFeedbackPer) VALUES ('${tfidfPer}', '${pubDatePer}', '${similarityPer}', '${explicitFeedbackPer}', '${implicitFeedbackPer}')`);
};

const checkExistsPercentages = async function() {
    let check = await dbConnector.query(`SELECT * FROM weighted_average_percentages`);
    return !check[0];
};

const updatePercentages = async function(tfidfPer, pubDatePer, similarityPer, explicitFeedbackPer, implicitFeedbackPer) {
    dbConnector.query(`UPDATE weighted_average_percentages SET tfidfPer = ${tfidfPer}, pubDatePer = ${pubDatePer}, similarityPer = ${similarityPer}, explicitFeedbackPer = ${explicitFeedbackPer}, implicitFeedbackPer = ${implicitFeedbackPer}`);
};

const getPercentages = async function() {
    let percentages = await dbConnector.query(`SELECT * FROM weighted_average_percentages`);
    return percentages[0];
};

const getMaxRelevance = async function(field) {
    let max = await dbConnector.query(`SELECT MAX(` + field + `) AS max FROM relevance`);
    return max[0].max;
};

const getMinRelevance = async function(field) {
    let min = await dbConnector.query(`SELECT MIN(` + field + `) AS min FROM relevance`);
    return min[0].min;
};

const normalizeRelevance = async function(field, max, min) {
    await dbConnector.query(`UPDATE relevance SET ` + field + ` = (` + field + ` - '${min}') / ('${max}' - '${min}')`);
};

const computeWeightedAverage = async function(tfidfRelValue, pubDateRelValue, similarityRelValue, explicitFeedbackValue, implicitFeedbackValue) {
    await dbConnector.query(`UPDATE relevance SET relevance_Avg = (tfidf * '${tfidfRelValue}') + (similarity * '${similarityRelValue}') + (explicitFeedbackValue * '${explicitFeedbackValue}') + (implicitFeedbackValue * '${implicitFeedbackValue}') + (date_Relevance * '${pubDateRelValue}')`);
};

module.exports = {
    saveArticleToDb: saveArticleToDb,
    getArticles: getArticles,
    getArticleDiseases: getArticleDiseases,
    mentionDoesNotExist: mentionDoesNotExist,
    saveArticleDiseaseMention: saveArticleDiseaseMention,
    incrementArticleDiseaseMentionCount: incrementArticleDiseaseMentionCount,
    getNumberOfMentionsBoth: getNumberOfMentionsBoth,
    getNumberOfMentionsDisease: getNumberOfMentionsDisease,
    getNumberArticlesWithDisease: getNumberArticlesWithDisease,
    getCountOfDiseasesInArticle: getCountOfDiseasesInArticle,
    getArticleDiseasesinMentionsTable: getArticleDiseasesinMentionsTable,
    getNumberArticlesinMentionsTable:getNumberArticlesinMentionsTable,
    getPubDateArticle: getPubDateArticle,
    getInitialId:getInitialId,
    getDoidNumberDisease: getDoidNumberDisease,
    relevanceDoesNotExists: relevanceDoesNotExists,
    updateArticleDiseaseRelevance: updateArticleDiseaseRelevance,
    saveArticleDiseaseRelevance: saveArticleDiseaseRelevance,
    insertPercentages: insertPercentages,
    checkExistsPercentages: checkExistsPercentages,
    updatePercentages: updatePercentages,
    getPercentages: getPercentages,
    getMaxRelevance: getMaxRelevance,
    getMinRelevance: getMinRelevance,
    normalizeRelevance: normalizeRelevance,
    computeWeightedAverage: computeWeightedAverage
};
