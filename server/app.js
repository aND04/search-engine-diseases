const http = require('request-promise');
const Twitter = require('twitter');

const xmlUtils = require('./utils/xml-utils');
const endpointUtils = require('./utils/enpoint-utils');
const dbpediaService = require('./services/dbpedia-service');
const pubmedService = require('./services/pubmed-service');
const flickrService = require('./services/flickr-service');

let medicalSpecialty = process.argv[2];
if (!medicalSpecialty) throw Error('Please specify a medical specialty field');
medicalSpecialty = medicalSpecialty.charAt(0).toUpperCase() + medicalSpecialty.slice(1);

http(endpointUtils.dbpedia(medicalSpecialty)).then(async (res) => {
    const diseases = xmlUtils.xpathFromXmlString(res, '//*[@name="name"]');
    const insertedId = await dbpediaService.saveMedicalSpecialtyToDb(medicalSpecialty);
    await dbpediaService.saveDiseasesToDb(diseases, insertedId);
    for (const disease of diseases) {
        /**
         * Pubmed
         */
        let diseaseId = await http(endpointUtils.pubmedArticleIds(disease)).then(async (res) => {
            const diseaseId = await dbpediaService.getDiseaseId(disease);
            const articleIds = await xmlUtils.xpathFromXmlString(res, '//Id');
            const uniqueArticleIds = [...new Set(articleIds)];
            for (const articleId of uniqueArticleIds) {
                await http(endpointUtils.pubmedArticle(articleId)).then(async (res) => {
                    const title = xmlUtils.xpathFromXmlString(res, '//ArticleTitle');
                    const abstract = xmlUtils.xpathFromXmlString(res, '//Abstract');
                    await pubmedService.saveArticleToDb(articleId, title, abstract, diseaseId);
                });
            }
            return diseaseId;
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
        const twitterClient = new Twitter({
            consumer_key: '8wSUS1FdrNyuXKfEnPuOFLOsG',
            consumer_secret: 'hSpiUUP437InwZe99z9ZJgW57nA556likYQddLUhSCbr0aQwpY',
            access_token_key: '1106575409121034240-s0zdj6CAnzZ2UBFui83NAAy26YA77t',
            access_token_secret: 'r2tyX11bPkWxsUBQQtma316HhhD3Yc2woqyBTZJpj3Haz'
        });
        const params = {screen_name: 'nodejs'};
        const tweets = await twitterClient.get(`/search/tweets.json?q=${disease}&result_type=popular`, params, async function(error, tweets, response) {
            if (!error) {
                console.log(tweets);
                return tweets;
            } else {
                console.error(error);
            }
        });
    }
}).then(() => process.exit());


