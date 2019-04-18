const dbConnector = require('../db/db-connector');
const stringUtils = require('../utils/string-utils');

const getPhotoId = async function (flickr_id) {
    const queryResult = await dbConnector.query(`SELECT id FROM flickr_photo where flickr_id = '${flickr_id}'`);
    return queryResult[0] ? queryResult[0].id : -1;
};

const photoExistsForCurrentDisease = async function (photoId, diseaseId) {
    const queryResult = await dbConnector.query(`SELECT * FROM flickr_photo_dbpedia_disease WHERE flickr_photo_id = ${photoId} AND dbpedia_disease_id = ${diseaseId}`);
    return !!queryResult[0];
};

const createRelationshipToDisease = async function (photoId, diseaseId) {
    await dbConnector.query(`INSERT INTO flickr_photo_dbpedia_disease (flickr_photo_id, dbpedia_disease_id) VALUES (${photoId}, ${diseaseId})`);
};

const setUpdatedAtFlickrPhotoValue = async function (photoId) {
    await dbConnector.query(`UPDATE flickr_photo SET updated_at = NOW() WHERE id = ${photoId}`);
};

const savePhotoToDb = async function(url, title, flickr_id, diseaseId) {
    const id = await getPhotoId(flickr_id);
    if (id === -1) {
        const localTitle = await stringUtils.encodeBase64(title);
        const queryResult = await dbConnector.query(`INSERT INTO flickr_photo(flickr_id, url, title) VALUES (${flickr_id}, '${url}', '${localTitle}')`);
        const photoId = queryResult.insertId;
        await createRelationshipToDisease(photoId, diseaseId);
    } else if (photoExistsForCurrentDisease(id, diseaseId)) {
        await setUpdatedAtFlickrPhotoValue(id);
    } else {
        await setUpdatedAtFlickrPhotoValue(id);
        await createRelationshipToDisease(id, diseaseId);
    }
};

module.exports = {
    savePhotoToDb: savePhotoToDb
};
