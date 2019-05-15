var express = require('express');
var router = express.Router();
var Article = require('../models/article');

router.post('/', function (req, res) {
  //Store the request params
  var data = {
    disease: req.body.disease,  //Disease name
    topN: req.body.topN        //Number of articles to show
  };

  Article.getTopNRelatedArticles(data,function (err, queryRes) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(queryRes);
    }
  });
});

module.exports = router;