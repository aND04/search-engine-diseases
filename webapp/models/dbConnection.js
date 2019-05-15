var mysql = require('mysql');

/** Connect to the database. */
var connection = mysql.createConnection({
  //host: 'appserver.alunos.di.fc.ul.pt',
  host: "localhost",
  user: 'root',
  password: 'lino',
  database: 'aw002'
});

module.exports = connection;

