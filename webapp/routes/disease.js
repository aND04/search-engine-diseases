var express = require('express');
var router = express.Router();
var Disease = require('../models/disease');
var StatusMessage = require('./status');

router.post('/', function (req, res) {
    //Store the request params
    var data = {
        disease: req.body.disease_name,  //Disease name
        topN: req.body.topn              //Number of diseases to show
    };

    Disease.getTopNRelatedDiseases(data, function (err, queryRes) {
        var contentType = 'application/json';  //TODO
        if (err) {
            var statusCode = 404;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);
            res.setHeader('Content-Type', contentType);
            res.json(err);
        } else {
            var statusCode = 200;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);
            res.setHeader('Content-Type', contentType);
            res.json(queryRes);
        }
    });
});

router.get('/getDiseases', function (req, res) {
    const term = req.query.term;

    Disease.getAllDiseases(term, function (err, queryRes) {
        var contentType = 'application/json';  //TODO
        if (err) {
            var statusCode = 404;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);
            res.setHeader('Content-Type', contentType);
            res.json(err);
        } else {
            var statusCode = 200;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);
            res.setHeader('Content-Type', contentType);
            res.json(queryRes);
        }
    });
});

module.exports = router;