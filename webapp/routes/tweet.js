var express = require('express');
var router = express.Router();
var Tweet = require('../models/tweet');

router.post('/', function (req, res) {

    var data = {
        Disease: req.body.disease_name,
        Topn: req.body.topn
    };

    Tweet.getTopNMostRecentTweets(data, function (err, queryRes) {
        if (err) {
            res.status(400).json(err);
            //console.log(err);
            //console.log(queryRes);
        } else {
            res.status(200).json(queryRes);

        }
    });
});

module.exports = router ;