/*import express from 'express';

const app = express();
const Twitter = require('twitter');

app.get('/api/v1/tweet/:topic', (req, res) => {
    const topic = req.param.topic;

    const twitterClient = new Twitter({
        consumer_key: '8wSUS1FdrNyuXKfEnPuOFLOsG',
        consumer_secret: 'hSpiUUP437InwZe99z9ZJgW57nA556likYQddLUhSCbr0aQwpY',
        access_token_key: '1106575409121034240-s0zdj6CAnzZ2UBFui83NAAy26YA77t',
        access_token_secret: 'r2tyX11bPkWxsUBQQtma316HhhD3Yc2woqyBTZJpj3Haz'
    });

    var params = {screen_name: 'nodejs'};
    twitterClient.get(`/search/tweets.json?q=${topic}&result_type=popular`, params, function(error, tweets, response) {
        if (!error) {
            res.status(200).send(tweets);
        } else {
            console.log(error);
            res.status(500).send(error);
        }
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});*/
const http = require('request-promise');
const xmlUtils = require('./utils/xml-utils');
const dbConnector = require('./db/db-connector');

let medicalSpecialty = process.argv[2];
if (!medicalSpecialty) throw Error('Please specify a medical specialty field');
medicalSpecialty = medicalSpecialty.charAt(0).toUpperCase() + medicalSpecialty.slice(1);

http(`http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Furi+%3Fname+where+%7B%0D%0A+%3Furi+a+dbo%3ADisease+.%0D%0A+%3Furi+dbp%3Afield+dbr%3A${medicalSpecialty}+.%0D%0A+%3Furi+foaf%3Aname+%3Fname%0D%0A%7D+LIMIT+10&format=text%2Fxml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+\\`).then(function (res) {
   return xmlUtils.xpathFromXmlString(res,'//*[@name="name"]');
}).catch(function (err) {
    console.error(err);
}).then(async (diseases) => {
    console.log(diseases);
    const insertId = await dbConnector.query(`INSERT INTO dbpedia_medical_specialty(description) value ('${medicalSpecialty}')`);
    diseases.forEach(async (disease) => {
        await dbConnector.query(`INSERT INTO dbpedia_disease(description, medical_specialty_id) values ('${disease}',${insertId})`);
    });
}).then(() => process.exit());


