var express = require('express');
var router = express.Router();
var Metadata = require('../models/metadata');

router.post('/', function (req, res) {

    var data = {
        Disease: req.body.disease_name
    };

    Metadata.getMetadata(data, function (err, queryRes) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(queryRes);

        }
    });
});

module.exports = router;