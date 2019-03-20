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
/*const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'appserver.alunos.di.fc.ul.pt',
    user: 'aw002',
    password: 'aw002',
    database: 'aw002'
});
async function asyncFunction() {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query("INSERT INTO dbpedia_medical_specialty(description) value (?)", ["mariadb"]);
        console.log('works', res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
        const rows = await conn.query("SELECT * from dbpedia_medical_specialty");
        console.log(rows);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}
asyncFunction().then(() => {
    console.log('done');
    process.exit();
});*/
const http = require('request-promise');
const xpath = require('xpath'), Dom = require('xmldom').DOMParser;

let medicalSpecialty = process.argv[2];
if (!medicalSpecialty) throw Error('Please specify a medical specialty field');
medicalSpecialty = medicalSpecialty.charAt(0).toUpperCase() + medicalSpecialty.slice(1);

http(`http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Furi+%3Fname+where+%7B%0D%0A+%3Furi+a+dbo%3ADisease+.%0D%0A+%3Furi+dbp%3Afield+dbr%3A${medicalSpecialty}+.%0D%0A+%3Furi+foaf%3Aname+%3Fname%0D%0A%7D+LIMIT+10&format=text%2Fxml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+\\`).then(function (res) {
    const doc = new Dom().parseFromString(res)
    const result = xpath.evaluate(
        '//*[@name="name"]',            // xpathExpression
        doc,                        // contextNode
        null,                       // namespaceResolver
        xpath.XPathResult.UNORDERED_NODE_ITERATOR_TYPE, // resultType
        null                        // result
    );
    let node = result.iterateNext();
    let array = [];
    while (node) {
        array.push(node.textContent);
        node = result.iterateNext();
    }
    return array;
}).catch(function (err) {
    console.error(err);
}).then((result) => {
    console.log(result);
});


