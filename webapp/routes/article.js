var express = require('express');
var router = express.Router();
var Article = require('../models/article');

router.post('/', function (req, res) {
  //Store the request params
  var data = {
    disease: req.body.disease_name,  //Disease name
    topN: req.body.topn              //Number of articles to show
  };

  Article.getTopNRelatedArticles(data,function (err, queryRes) {
    if (err) {
      console.log(data);
      res.status(404).json(err);
    } else {
      res.status(200).json(queryRes);
    }
  });
});

module.exports = router;