const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const saveDiseasesToDb = async function (diseases, medicalSpecialtyId) {
    for (const disease of diseases) {
        let sanitizedDescription = stringUtils.sanitize(disease);
        let id = await getDiseaseId(sanitizedDescription);
        if (id === -1) {
            await dbConnector.query(`INSERT INTO dbpedia_disease(description, medical_specialty_id) values ('${sanitizedDescription}',${medicalSpecialtyId})`);
        } else {
            await dbConnector.query(`UPDATE dbpedia_disease SET updated_at = NOW() WHERE id = ${id}`);
        }
    }
};

const saveMedicalSpecialtyToDb = async function (medicalSpecialty) {
    const id = await getMedicalSpecialtyFromDb(medicalSpecialty);
    if (id === -1) {
        const queryResult = await dbConnector.query(`INSERT INTO dbpedia_medical_specialty(description) value ('${medicalSpecialty}')`);
        return queryResult.insertId;
    } else {
        await dbConnector.query(`UPDATE dbpedia_medical_specialty SET updated_at = current_timestamp WHERE id = ${id}`);
        return id;
    }
};

const getDiseaseId = async function (disease) {
    let sanitizedDescription = stringUtils.sanitize(disease);
    const queryResult = await dbConnector.query(`SELECT id FROM dbpedia_disease where description = '${sanitizedDescription}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const isDiseaseNew = async function (diseaseId) {
    const queryResult = await dbConnector.query(`SELECT updated_at FROM dbpedia_disease where id = '${diseaseId}'`);
    return !queryResult[0]['updated_at'];
};

const getMedicalSpecialtyFromDb = async function (medicalSpecialty) {
    const queryResult = await dbConnector.query(`SELECT id FROM dbpedia_medical_specialty where description = '${medicalSpecialty}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

module.exports = {
    saveDiseasesToDb: saveDiseasesToDb,
    saveMedicalSpecialtyToDb: saveMedicalSpecialtyToDb,
    getDiseaseId: getDiseaseId,
    isDiseaseNew: isDiseaseNew,
    getMedicalSpecialtyFromDb: getMedicalSpecialtyFromDb
};
