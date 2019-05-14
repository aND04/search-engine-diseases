var express = require('express');
var router = express.Router();
var Flickr = require('../models/flickr');

router.post('/', function (req, res) {

    var data = {
        Disease: req.body.disease_name,
        Topn: req.body.topn
    };

    Flickr.getTopNMostRecentFlickPhotos(data, function (err, queryRes) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(queryRes);

        }
    });
});

module.exports = router;