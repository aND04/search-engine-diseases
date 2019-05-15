var db = require('./dbConnection');

/** Model with the Flickr queries. */
var Flickr = {
    /** For a given disease get the top-n most recent flickr photos. */
    getTopNMostRecentFlickPhotos: function (result, callback) {
        var sql = "SELECT  flickrPhoto.url, flickrPhoto.title, flickrPhoto.flickr_date " +
            "FROM dbpedia_disease disease, flickr_photo_dbpedia_disease flickrD, " +
                "flickr_photo flickrPhoto " +
            "WHERE disease.description = '" + result.Disease +
        "' AND disease.id = flickrD.dbpedia_disease_id " +
            "AND flickrPhoto.id = flickrD.flickr_photo_id " +
            "ORDER BY flickrPhoto.flickr_date DESC " +
            "LIMIT " + result.Topn;

        db.query(sql, function (err, res) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    }
};

module.exports = Flickr;