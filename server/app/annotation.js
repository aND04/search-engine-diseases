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
        if (!articleDiseases.includes(diseaseId) && mentionDoesNotExists) {
            if (diseaseId === -1) {
                const specialtyDiseases = await getMedicalSpecialtyForDisease(disease);
                for (const specialtyDisease of specialtyDiseases) {
                    if (specialtyDisease.length > 0) {
                        let medicalSpecialtyId = await dbpediaService.getMedicalSpecialtyIdFromDb(specialtyDisease);
                        if (medicalSpecialtyId === -1) {
                            medicalSpecialtyId = await dbpediaService.saveMedicalSpecialtyToDb(specialtyDisease);
                        }
                        await dbpediaService.saveDiseasesToDb(disease, medicalSpecialtyId);
                    }
                }
            } else {
                await pubmedService.saveArticleDiseaseMention(articleId, diseaseId);
            }
        } else if (!mentionDoesNotExists) {
            await pubmedService.incrementArticleDiseaseMentionCount(articleId, diseaseId);
        }
    }
}

async function getMedicalSpecialtyForDisease(disease) {
    const dbpediaSpecialty = await http(endpointUtils.dbPediaDiseaseMedicalSpecialtyEndpoint(disease));
    return dbpediaSpecialty.split(/"fieldName"|"|\n/).filter(e => e !== '');
}

exports.annotation = async function () {
    const articles = await pubmedService.getArticles();
    for (const article of articles) {
        // const titleMentions = await http(endpointUtils.merEndpoint(stringUtils.decodeBase64(article['title'])));
        // const titleDiseases = stringUtils.parseTSVtoArray(titleMentions);
        // console.log(titleDiseases);

        const abstractMentions = await http(endpointUtils.merEndpoint(stringUtils.decodeBase64(article['abstract'])));
        const abstractDiseases = stringUtils.parseTSVtoArray(abstractMentions);
        await handleMentions(abstractDiseases, article['id']);
    }
};
