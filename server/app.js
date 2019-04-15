const http = require('request-promise');
const Twitter = require('twitter');

const config = require('./config');

const xmlUtils = require('./utils/xml-utils');
const endpointUtils = require('./utils/enpoint-utils');
const dbpediaService = require('./services/dbpedia-service');
const pubmedService = require('./services/pubmed-service');
const flickrService = require('./services/flickr-service');
const twitterService = require('./services/twitter-service');

let medicalSpecialty = process.argv[2];
if (!medicalSpecialty) throw Error('Please specify a medical specialty field');
medicalSpecialty = medicalSpecialty.charAt(0).toUpperCase() + medicalSpecialty.slice(1);

/**
 * Dbpedia
 */
http(endpointUtils.dbpedia(medicalSpecialty)).then(async (res) => {
    const diseases = xmlUtils.xpathFromXmlString(res, '//*[@name="name"]');
    const medicalSpecialtyId = await dbpediaService.saveMedicalSpecialtyToDb(medicalSpecialty);
    await dbpediaService.saveDiseasesToDb(diseases, medicalSpecialtyId);
    for (const disease of diseases) {
        console.log(`\n\t\tProcessing ${disease}...`);
        let diseaseId = await dbpediaService.getDiseaseId(disease);
        /**
         * Pubmed
         */
        await http(endpointUtils.pubmedArticleIds(disease)).then(async (res) => {
            const diseaseId = await dbpediaService.getDiseaseId(disease);
            const articleIds = await xmlUtils.xpathFromXmlString(res, '//Id');
            const uniqueArticleIds = [...new Set(articleIds)];
            for (const articleId of uniqueArticleIds) {
                await http(endpointUtils.pubmedArticle(articleId)).then(async (res) => {
                    const title = xmlUtils.xpathFromXmlString(res, '//ArticleTitle');
                    const abstract = xmlUtils.xpathFromXmlString(res, '//Abstract');
                    if (abstract.length > 0){
                        await pubmedService.saveArticleToDb(articleId, title, abstract, diseaseId);
                    }
                });
            }
        });
        /**
         * Flickr
         */
        const flickrCallResult = await http(endpointUtils.flickrEndpoint(disease));
        const titles = await xmlUtils.xpathFromXmlString(flickrCallResult, '//@title');
        const farmIds = await xmlUtils.xpathFromXmlString(flickrCallResult, '//@farm');
        const serverIds = await xmlUtils.xpathFromXmlString(flickrCallResult, '//@server');
        const photoIds = await xmlUtils.xpathFromXmlString(flickrCallResult, '//@id');
        const secretIds = await xmlUtils.xpathFromXmlString(flickrCallResult, '//@secret');
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
}).then(() => process.exit());
