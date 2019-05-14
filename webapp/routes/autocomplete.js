var express = require('express');
var router = express.Router();
var allDiseaseModel = require('../models/allDIseases');

router.get('/:searches', function (req, res) {
    const a = req.query.term
    //const searches = req.params.searches;
    console.log("searches: " + a);
    allDiseaseModel.getAllDiseases(a, function (err, queryRes) {
        console.log("queryRes: " + queryRes);
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(queryRes);

        }
    })

});

module.exports = router;
