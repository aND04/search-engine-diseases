# Disease search engine

Disease search engine is a nodejs based application to search and display information regarding diseases on [Dbpedia](https://wiki.dbpedia.org/) that relate to a specific [medical specialty](https://en.wikipedia.org/wiki/Specialty_(medicine)).

#### Tech

Disease search engine uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Mariadb](https://mariadb.org/) - dbms of choice for the project

Disease search engine is for now a private github repository, but will soon (by the end of semester) be open source.

#### Installation
###### Requirements:
* [Node.js](https://nodejs.org/) v7.6+
* [Mariadb](https://downloads.mariadb.org/) v5.5.60

###### Steps:
* database:
    * open a database manager (mariadb console, heidisql, ...)
    * create database: `CREATE DATABASE aw002;`
    * create user: `CREATE USER aw002@'localhost' IDENTIFIED BY 'aw002';`
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
