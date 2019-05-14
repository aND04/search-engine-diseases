# Disease search engine

Disease search engine is a nodejs based application to search and display information regarding diseases on [Dbpedia](https://wiki.dbpedia.org/) that relate to a specific [medical specialty](https://en.wikipedia.org/wiki/Specialty_(medicine)).

#### Tech

Disease search engine uses a number of open source projects to work properly:

* [node.js](https://nodejs.org/en/) - evented I/O for the backend
* [Mariadb](https://mariadb.org/) - dbms of choice for the project

Disease search engine is for now a private github repository, but will soon (by the end of semester) be open source.

#### Installation
###### Requirements:
* [Node.js](https://nodejs.org/) v7.6+
* [Mariadb](https://downloads.mariadb.org/) v5.5.60

###### Steps:
* database:
    * open a database manager (mariadb console, heidisql, ...)
    * create database: `CREATE DATABASE aw002 CHARACTER SET utf8 COLLATE utf8_unicode_ci;`
    * create user: `CREATE USER aw002@'localhost' IDENTIFIED BY 'aw002';`
    * `use aw002;`
    * run all the `.sql` files in `/path/to/project/server/db/sql/` 
* configure application for localhost database:
    * change file `/path/to/project/server/db/db-connector.js:`
        * `host: 'appserver.alunos.di.fc.ul.pt',` -> `host: 'localhost',`
* install server dependencies
```sh
$ git clone https://github.com/aND04/search-engine-diseases.git
$ cd /path/to/project/server
$ npm install
```
#### Run
``` sh
$ npm start medical_specialty
```
`medical_specialty` will be the one of choice for the execution of the application.

#### Demo II
* Statistics page: `http://appserver.alunos.di.fc.ul.pt/~aw002/search-engine-diseases/statistics/statistics_annotation.php`
* Queries: 
    * `select paddm.pubmed_article_id, paddm.dbpedia_disease_id, paddm.number_of_mentions, paddm.doidDisease, r.tfidf, r.similarity, r.explicitFeedbackValue, r.implicitFeedbackValue, r.date_Relevance, r.relevance_Avg from pubmed_article_dbpedia_disease_mentions paddm, relevance r where paddm.pubmed_article_id=1 and r.pubmed_article_id =paddm.pubmed_article_id ORDER BY r.relevance_Avg desc;`
    * `select id, pub_date from pubmed_article where id = 88;`

