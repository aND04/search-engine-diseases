const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');
const dbpediaService = require('./dbpedia-service');

const getWikipageId = async function (wikipageId) {
    const queryResult = await dbConnector.query(`SELECT id FROM dbpedia_metadata_disease where wikipageId = '${wikipageId}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const createRelationshipToSpecialty = async function (metadataId, medicalSpecialtyId) {
    await dbConnector.query(`INSERT INTO dbpedia_metadata_dbpedia_medical_specialty (dbpedia_metadata_id, dbpedia_medical_specialty_id) VALUES (${metadataId}, ${medicalSpecialtyId})`);
};

const setUpdatedAtMetadataValue = async function (metadataId) {
    await dbConnector.query(`UPDATE dbpedia_metadata_disease SET updated_at = NOW() WHERE id = ${metadataId}`);
};

const saveMetadataToDb = async function (wikipageId, uri, diseaseName, image, comment, medicalSpecialtyId) {
    const id = await getWikipageId(wikipageId);
    if (id == -1 ){
        const sanitizedDiseaseName = await stringUtils.sanitize(diseaseName);
        const diseaseId = await dbpediaService.getDiseaseId(sanitizedDiseaseName);
        //Check if disease exists in database, otherwise don't add the metadata
        if (diseaseId != -1) {
            const localComment = await stringUtils.encodeBase64(comment);
            const queryResult = await dbConnector.query(`INSERT INTO dbpedia_metadata_disease(wikipageId, uri, diseaseName, image, comment) VALUES ('${wikipageId}', '${uri}', '${sanitizedDiseaseName}', '${image}', '${localComment}')`);
            const metadataId = queryResult.insertId;
            await createRelationshipToSpecialty(metadataId, medicalSpecialtyId);
        }
    } else {
        await setUpdatedAtMetadataValue(id);
    }
}

module.exports = {
    saveMetadataToDb: saveMetadataToDb
};