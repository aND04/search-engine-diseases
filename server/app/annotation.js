const http = require('request-promise');

const pubmedService = require('./services/pubmed-service');
const dbpediaService = require('./services/dbpedia-service');

const stringUtils = require('./utils/string-utils');
const endpointUtils = require('./utils/enpoint-utils');

async function handleMentions(mentions, articleId) {
    const articleDiseases = await pubmedService.getArticleDiseases(articleId);

    for (let disease of mentions) {

        disease = stringUtils.toSentenceCase(disease);
        const diseaseId = await dbpediaService.getDiseaseId(disease);
        const mentionDoesNotExists = await pubmedService.mentionDoesNotExist(articleId, diseaseId);
        const relevanceDoesNotExists = await pubmedService.relevanceDoesNotExists(articleId, diseaseId);

        const doidDiseaseRespone = await http(endpointUtils.merEndpoint(disease));
        const doidDisease = stringUtils.getDoidUrl(doidDiseaseRespone)[0];

        if (!articleDiseases.includes(diseaseId) && mentionDoesNotExists) {
            if (diseaseId === -1) {
                const specialtyDiseases = await getMedicalSpecialtyForDisease(disease);
                if (specialtyDiseases.toString() !== '') {
                    for (const specialtyDisease of specialtyDiseases) {
                        if (specialtyDisease.length > 0) {
                            let medicalSpecialtyId = await dbpediaService.getMedicalSpecialtyIdFromDb(specialtyDisease);

                            if (medicalSpecialtyId === -1) {
                                medicalSpecialtyId = await dbpediaService.saveMedicalSpecialtyToDb(specialtyDisease);
                            }

                            await dbpediaService.saveStrangeDiseasesToDb(disease, medicalSpecialtyId);

                        }
                    }
                    let queryId = await dbpediaService.getStrangeDiseaseId();
                    let diseaseSId = queryId[0] ? queryId[0].lastId : -1;

                    await pubmedService.saveArticleDiseaseMention(articleId, diseaseSId, doidDisease);
                }
            } else {
                await pubmedService.saveArticleDiseaseMention(articleId, diseaseId, doidDisease);
            }
        } else if (!mentionDoesNotExists && relevanceDoesNotExists) {
            await pubmedService.incrementArticleDiseaseMentionCount(articleId, diseaseId);
        }
    }

    await relevanceArticle(articleId);
}

async function relevanceArticle(articleId){
    const diseasesNumber = await pubmedService.getCountOfDiseasesInArticle(articleId);
    const query_diseasesInArticle = await pubmedService.getArticleDiseasesinMentionsTable(articleId);
    const NumberDocsinMentionsTable = await pubmedService.getNumberArticlesinMentionsTable();


    for (let i=0; i< diseasesNumber; i++){
        let diseaseId = query_diseasesInArticle[i] ? query_diseasesInArticle[i].dbpedia_disease_id: -1;

        const numberOfMentionsDiseaseInArticle = await pubmedService.getNumberOfMentionsBoth(articleId, diseaseId);
        const numberMentionsAllDiseases = await pubmedService.getNumberOfMentionsDisease(articleId);
        const NumberOfMentionsArticle = await  pubmedService.getNumberArticlesWithDisease(diseaseId);

        //TFIDF
        const tf = numberOfMentionsDiseaseInArticle/ numberMentionsAllDiseases;
        const idf = Math.log(NumberDocsinMentionsTable/NumberOfMentionsArticle);
        const tfidf = tf*idf;

        //Published Date
        const queryDate =  await pubmedService.getPubDateArticle(articleId);
        const pubDate = queryDate[0] ? queryDate[0].pub_Date: -1;
        const actualDate = new Date();
        const diffTime = Math.abs(actualDate.getTime() - pubDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const date_Relevance = 1 / (1 + diffDays);

        //Similarity
        const diseaseInitial_query = await pubmedService.getInitialId(articleId);
        const initialDiseaseName = diseaseInitial_query[0] ? diseaseInitial_query[0].description: -1;
        const doidDiseaseResponse = await http(endpointUtils.merEndpoint(initialDiseaseName));
        const doidDiseaseInitial = parseInt(stringUtils.getDoidUrl(doidDiseaseResponse)[0]);
        const DoidDiseaseActual = await pubmedService.getDoidNumberDisease(diseaseId);

        let tsvSimilarity = await http(endpointUtils.DiShInEndpoint(doidDiseaseInitial, DoidDiseaseActual));
        let similarity = parseFloat(stringUtils.parseDiShInTSVtoValue(tsvSimilarity));

        //Relevance feedback
        let explicitFeedback = Math.floor(Math.random() * 6);
        let implicitFeedback = Math.floor(Math.random() * 6);

        const relevanceDoesNotExists = await pubmedService.relevanceDoesNotExists(articleId, diseaseId);
            if(relevanceDoesNotExists){
                await pubmedService.saveArticleDiseaseRelevance(articleId, diseaseId, tfidf, similarity, explicitFeedback, implicitFeedback, date_Relevance);
                console.log("Relevance added. Article Id: " + articleId + "   Disease Id: " + diseaseId);
            }else{
                await pubmedService.updateArticleDiseaseRelevance(articleId, diseaseId, tfidf, explicitFeedback, implicitFeedback);
                console.log("Relevance updated. Article Id: " + articleId + "   Disease Id: " + diseaseId);
            }
    }

};

async function getMedicalSpecialtyForDisease(disease) {
    const dbpediaSpecialty = await http(endpointUtils.dbPediaDiseaseMedicalSpecialtyEndpoint(disease));
    return dbpediaSpecialty.split(/"fieldName"|"|\n/).filter(e => e !== '');
};

exports.annotation = async function () {
    //Insert percentage values to db
    let doesNotExistPer = await pubmedService.checkExistsPercentages();
    if (doesNotExistPer) {
        await pubmedService.insertPercentages(0.2, 0.15, 0.15, 0.2, 0.3);
    }

    const articles = await pubmedService.getArticles();
    for (const article of articles) {
        //Analyze title with MER
        const titleMentions = await http(endpointUtils.merEndpoint(stringUtils.decodeBase64(article['title'])));
        const titleDiseases = stringUtils.parseTSVtoArray(titleMentions);

        //Analyze abstract with MER
        const abstractMentions = await http(endpointUtils.merEndpoint(stringUtils.decodeBase64(article['abstract'])));
        const abstractDiseases = stringUtils.parseTSVtoArray(abstractMentions);

        const mentionedDiseases = titleDiseases.concat(abstractDiseases);
        await handleMentions(mentionedDiseases, article['id']);
    }

    //Normalize relevance values
   /* console.log("Normalizing relevance values...");
    const tfidfMax = await pubmedService.getMaxRelevance('tfidf');
    const tfidfMin = await pubmedService.getMinRelevance('tfidf');
    await pubmedService.normalizeRelevance('tfidf', tfidfMax,  tfidfMin);
    const explicitFeedbackMax = await pubmedService.getMaxRelevance('explicitFeedbackValue');
    const explicitFeedbackMin = await pubmedService.getMinRelevance('explicitFeedbackValue');
    await pubmedService.normalizeRelevance('explicitFeedbackValue', explicitFeedbackMax, explicitFeedbackMin);
    const implicitFeedbackMax = await pubmedService.getMaxRelevance('implicitFeedbackValue');
    const implicitFeedbackMin = await pubmedService.getMinRelevance('implicitFeedbackValue');
    await pubmedService.normalizeRelevance('implicitFeedbackValue', implicitFeedbackMax, implicitFeedbackMin);
*/
    //Weighted average of previous values
    let percentages = await pubmedService.getPercentages();
    let tfidfRelValue = percentages.tfidfPer;
    let pubDateRelValue = percentages.pubDatePer;
    let similarityRelValue = percentages.similarityPer;
    let explicitFeedbackValue = percentages.explicitFeedbackPer;
    let implicitFeedbackValue = percentages.implicitFeedbackPer;
    await pubmedService.computeWeightedAverage(tfidfRelValue, pubDateRelValue, similarityRelValue, explicitFeedbackValue, implicitFeedbackValue);
};






