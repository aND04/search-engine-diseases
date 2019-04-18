const http = require('request-promise');
const Twitter = require('twitter');

const config = require('../config');

const xmlUtils = require('./utils/xml-utils');
const endpointUtils = require('./utils/enpoint-utils');
const dbpediaService = require('./services/dbpedia-service');
const pubmedService = require('./services/pubmed-service');
const flickrService = require('./services/flickr-service');
const twitterService = require('./services/twitter-service');

exports.retrieval = async function() {
    let medicalSpecialty = process.argv[3];
    if (!medicalSpecialty) throw Error('Please specify a medical specialty field');
    medicalSpecialty = medicalSpecialty.charAt(0).toUpperCase() + medicalSpecialty.slice(1);

    /**
     * DBPedia
     */
    const dbPediaResult = await http(endpointUtils.dbpedia(medicalSpecialty));
    const diseases = xmlUtils.xpathFromXmlString(dbPediaResult, '//*[@name="name"]');
    const medicalSpecialtyId = await dbpediaService.saveMedicalSpecialtyToDb(medicalSpecialty);
    await dbpediaService.saveDiseasesToDb(diseases, medicalSpecialtyId);
    for (const disease of diseases) {
        console.log(`\n\t\tProcessing ${disease}...`);
        /**
         * Pubmed
         */
        const pubmedResult = await http(endpointUtils.pubmedArticleIds(disease));
        const diseaseId = await dbpediaService.getDiseaseId(disease);
        const articleIds = xmlUtils.xpathFromXmlString(pubmedResult, '//Id');
        const uniqueArticleIds = [...new Set(articleIds)];
        for (const articleId of uniqueArticleIds) {
            const pubmedArticle = await http(endpointUtils.pubmedArticle(articleId));
            const title = xmlUtils.xpathFromXmlString(pubmedArticle, '//ArticleTitle');
            const abstract = xmlUtils.xpathFromXmlString(pubmedArticle, '//Abstract');
            if (abstract.length > 0){
                await pubmedService.saveArticleToDb(articleId, title, abstract, diseaseId);
            }
        }
        /**
         * Flickr
         */
        const flickrCallResult = await http(endpointUtils.flickrEndpoint(disease));
        const titles = xmlUtils.xpathFromXmlString(flickrCallResult, '//@title');
        const farmIds = xmlUtils.xpathFromXmlString(flickrCallResult, '//@farm');
        const serverIds = xmlUtils.xpathFromXmlString(flickrCallResult, '//@server');
        const photoIds = xmlUtils.xpathFromXmlString(flickrCallResult, '//@id');
        const secretIds = xmlUtils.xpathFromXmlString(flickrCallResult, '//@secret');
        const length = farmIds.length;

        for (let i = 0; i < length; i++) {
            let url = `https://farm${farmIds[i]}.staticflickr.com/${serverIds[i]}/${photoIds[i]}_${secretIds[i]}.jpg`;
            await flickrService.savePhotoToDb(url, titles[i], photoIds[i], diseaseId);
        }
        /**
         * Twitter
         */
        const twitterClient = new Twitter(config.twitter);
        const params = {screen_name: 'nodejs'};
        const tweets = await twitterClient.get(`/search/tweets.json?q=${disease}&result_type=popular`, params);

        for (const tweet of tweets['statuses']) {
            let url = `https://twitter.com/statuses/${tweet['id_str']}`;
            await twitterService.saveTweetToDb(tweet['id_str'], tweet['text'], tweet['created_at'], url, diseaseId);
        }
    }
}
