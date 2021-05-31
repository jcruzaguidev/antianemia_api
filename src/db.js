const mysql = require('mysql');
const dbConfig = require('../src/config/db.config');

const conn = mysql.createConnection({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
	socketPath: dbConfig.socketPath
});

conn.connect(function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Success connection!");
	}
});

module.exports = conn;
