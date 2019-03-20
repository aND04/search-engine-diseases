const dbConnector = require('../db/db-connector');

const saveDiseasesToDb = async function (diseases, msId) {
    for (const disease of diseases) {
        await dbConnector.query(`INSERT INTO dbpedia_disease(description, medical_specialty_id) values ('${disease}',${msId})`);
    }
};

const saveMedicalSpecialtyToDb = async function (medicalSpecialty) {
    const queryResult = await dbConnector.query(`INSERT INTO dbpedia_medical_specialty(description) value ('${medicalSpecialty}')`);
    return queryResult.insertId;
};

const getDiseaseId = async function (disease) {
    disease = disease.charAt(0).toUpperCase() + disease.slice(1);
    const queryResult = await dbConnector.query(`SELECT id FROM dbpedia_disease where description = '${disease}'`);
    return queryResult[0].id;
};

module.exports = {
    saveDiseasesToDb: saveDiseasesToDb,
    saveMedicalSpecialtyToDb: saveMedicalSpecialtyToDb,
    getDiseaseId: getDiseaseId
};
