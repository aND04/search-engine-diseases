var db = require('./dbConnection');

/** Model with the Flickr queries. */
var Flickr = {
    /** For a given disease get the top-n most recent flickr photos. */
    getTopNMostRecentFlickPhotos: function (req, result) {
        var sql = "SELECT  flickrPhoto.url, flickrPhoto.title, flickrPhoto.created_at " +
            "FROM dbpedia_disease disease, flickr_photo_dbpedia_disease flickrD, " +
            "flickr_photo flickrPhoto " +
            "WHERE disease.description = '" + req.disease + "' " +
            "AND disease.id = flickrD.dbpedia_disease_id " +
            "AND flickrPhoto.id = flickrD.flickr_photo_id " +
            "ORDER BY flickrPhoto.created_at DESC " +
            "LIMIT " + req.topN;

        db.query(sql, function (err, res) {
            if (err) {
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }
};

module.exports = Flickr;
