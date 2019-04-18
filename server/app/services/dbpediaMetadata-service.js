const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const getWikipageId = async function (wikipageId) {
    const queryResult = await dbConnector.query(`SELECT id FROM dbpedia_metadata_disease where wikipageId = '${wikipageId}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const createRelationshipToDisease = async function (metadataId, medicalSpecialtyId) {
    await dbConnector.query(`INSERT INTO dbpedia_metadata_dbpedia_medical_specialty (dbpedia_metadata_id, dbpedia_medical_specialty_id) VALUES (${metadataId}, ${medicalSpecialtyId})`);
};

const metadataExistsForCurrentDisease = async function (metadataId, medicalSpecialtyId) {
    const queryResult = await dbConnector.query(`SELECT * FROM dbpedia_metadata_dbpedia_medical_specialty WHERE dbpedia_metadata_id = ${metadataId} AND dbpedia_medical_specialty_id = ${medicalSpecialtyId}`);
    return !!queryResult[0];
};

const setUpdatedAtMetadataValue = async function (metadataId) {
    await dbConnector.query(`UPDATE dbpedia_metadata_disease SET updated_at = NOW() WHERE id = ${metadataId}`);
};

const saveMetadataToDb = async function (wikipageId, uri, diseaseName, image, diseaseField, deathName, medicalSpecialtyId) {
    const id = await getWikipageId(wikipageId);
    if (id == -1) {
        const localDiseaseName = await stringUtils.encodeBase64(diseaseName);
        const localDiseaseField = await stringUtils.encodeBase64(diseaseField);
        const localDeathName = await stringUtils.encodeBase64(deathName);
        const queryResult = await dbConnector.query(`INSERT INTO dbpedia_metadata_disease(wikipageId, uri, diseaseName, image, diseaseField, deathName) VALUES ('${wikipageId}', '${uri}', '${localDiseaseName}', '${image}', '${localDiseaseField}', '${localDeathName}')`);
        const metadataId = queryResult.insertId;
        await createRelationshipToDisease(metadataId, medicalSpecialtyId);
    } else if (metadataExistsForCurrentDisease(id, medicalSpecialtyId)) {
        await setUpdatedAtMetadataValue(id);
    } else {
        await setUpdatedAtMetadataValue(id);
        await createRelationshipToDisease(id, medicalSpecialtyId);
    }
}

module.exports = {
    saveMetadataToDb: saveMetadataToDb
};