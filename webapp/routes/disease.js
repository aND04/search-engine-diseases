var express = require('express');
var router = express.Router();
var Disease = require('../models/disease');

router.post('/', function (req, res) {
    //Store the request params
    var data = {
        disease: req.body.disease,  //Disease name
        topN: req.body.topN        //Number of diseases to show
    };

    Disease.getTopNRelatedDiseases(data, function (err, queryRes) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(queryRes);
        }
    });
});

router.get('/getDiseases/:searches', function (req, res) {
    const term = req.query.term;
    console.log("searches: " + term);

    Disease.getAllDiseases(term, function (err, queryRes) {
        console.log("queryRes: " + queryRes);
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(queryRes);
        }
    });
});

module.exports = router;