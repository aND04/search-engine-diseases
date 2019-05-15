var express = require('express');
var router = express.Router();
var Metadata = require('../models/metadata');

router.post('/', function (req, res) {
    //Store the request params
    var data = {
        disease: req.body.disease_name  //Disease name
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