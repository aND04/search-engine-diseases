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
        if (err) {
            var statusCode = 404;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);
            res.setHeader('Content-Type', 'application/json');
            res.json({'error': 'Error getting related diseases!'});
        } else {
            var reqContentType = req.body.requestType;
            var statusCode = 200;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);

            if (reqContentType == 'application/json') {
                res.setHeader('Content-Type', 'application/json');
                res.json(queryRes);
            } else if (reqContentType == 'application/xml') {
                var xmlResponse = js2xmlparser.parse("disease", queryRes);
                res.setHeader('Content-Type', 'application/xml');
                res.write(xmlResponse);
            }
        }
    });
});

router.get('/getDiseases', function (req, res) {
    Disease.getAllDiseases(req, function (err, queryRes) {
        if (err) {
            var statusCode = 404;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);
            res.setHeader('Content-Type', 'application/json');
            res.json({'error': 'Error getting diseases for autocomplete!'});
        } else {
            var reqContentType = req.query.contentType;
            var statusCode = 200;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);

            if (reqContentType == 'application/json') {
                res.setHeader('Content-Type', 'application/json');
                res.json(queryRes);
            } else if (reqContentType == 'application/xml') {
                var xmlResponse = js2xmlparser.parse("disease", queryRes);
                res.setHeader('Content-Type', 'application/xml');
                res.write(xmlResponse);
            }
        }
    });
});

module.exports = router;