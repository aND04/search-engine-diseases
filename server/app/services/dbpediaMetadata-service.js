const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');
const dbpediaService = require('./dbpedia-service');

const getWikipageId = async function (wikipageId) {
    const queryResult = await dbConnector.query(`SELECT id FROM dbpedia_metadata_disease where wikipageId = '${wikipageId}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const setUpdatedAtMetadataValue = async function (metadataId) {
    await dbConnector.query(`UPDATE dbpedia_metadata_disease SET updated_at = NOW() WHERE id = ${metadataId}`);
};

const saveMetadataToDb = async function (wikipageId, uri, image, comment, diseaseName) {
    const id = await getWikipageId(wikipageId);
    if (id == -1 ){
        const sanitizedDiseaseName = await stringUtils.sanitize(diseaseName);
        const sanitizedImage = await stringUtils.sanitize(image);
        const diseaseId = await dbpediaService.getDiseaseId(sanitizedDiseaseName);
        //Check if disease exists in database, otherwise don't add the metadata
        if (diseaseId != -1) {
            const localComment = await stringUtils.encodeBase64(comment);
            await dbConnector.query(`INSERT INTO dbpedia_metadata_disease(diseaseId, wikipageId, uri, image, comment) VALUES ('${diseaseId}', '${wikipageId}', '${uri}', '${sanitizedImage}', '${localComment}')`);
        }
    } else {
        await setUpdatedAtMetadataValue(id);
    }
}

module.exports = {
    saveMetadataToDb: saveMetadataToDb
};