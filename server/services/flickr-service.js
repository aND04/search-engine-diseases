const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const getPhotoId = async function (flickr_id) {
    const queryResult = await dbConnector.query(`SELECT id FROM flickr_photo where flickr_id = '${flickr_id}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const savePhotoToDb = async function(url, title, flickr_id, diseaseId) {
    const id = await getPhotoId(flickr_id);
    if (id === -1) {
        const localTitle = await stringUtils.sanitize(title);
        const queryResult = await dbConnector.query(`INSERT INTO flickr_photo(flickr_id, url, title) VALUES (${flickr_id}, '${url}', '${localTitle}')`);
        const photoId = queryResult.insertId;
        await dbConnector.query(`INSERT INTO flickr_photo_dbpedia_disease(flickr_photo_id, dbpedia_disease_id) VALUES (${photoId}, ${diseaseId})`);
    } else {
        await dbConnector.query(`INSERT INTO flickr_photo_dbpedia_disease(flickr_photo_id, dbpedia_disease_id) VALUES (${id}, ${diseaseId})`);
    }
};

module.exports = {
    savePhotoToDb: savePhotoToDb
};