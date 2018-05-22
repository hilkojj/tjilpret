
const fs = require("fs");
const password = fs.readFileSync(__dirname + "/database_password.txt").toString();
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: password,
    database: "tjillepret"
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

module.exports = {
    connection: connection
}