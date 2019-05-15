var mysql = require('mysql');

/** Connect to the database. */
var connection = mysql.createConnection({
  host: 'appserver.alunos.di.fc.ul.pt',
  //host: "localhost",
  user: 'aw002',
  password: 'aw002',
  database: 'aw002'
});

module.exports = connection;

