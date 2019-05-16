var express = require('express');
var router = express.Router();
var js2xmlparser = require("js2xmlparser");

var Article = require('../models/article');
var StatusMessage = require('./status');

router.post('/', function (req, res) {
    //Store the request params
    var data = {
        disease: req.body.disease_name,  //Disease name
        topN: req.body.topn             //Number of articles to show
    };

    Article.getTopNRelatedArticles(data,function (err, queryRes) {
        if (err) {
            var statusCode = 404;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);
            res.setHeader('Content-Type', 'application/json');
            res.json({'error': 'Error getting related articles!'});
        } else {
            var reqContentType = req.body.requestType;
            var statusCode = 200;
            res.status(statusCode);
            res.statusMessage = StatusMessage.getStatusMessage(statusCode);

            if (reqContentType == 'application/json') {
                res.setHeader('Content-Type', 'application/json');
                res.json(queryRes);
            } else if (reqContentType == 'application/xml') {
                var xmlResponse = js2xmlparser.parse("article", queryRes);
                res.setHeader('Content-Type', 'application/xml');
                res.write(xmlResponse);
            }
        }
    });
});

module.exports = router;