
const fs = require("fs");
const password = fs.readFileSync(__dirname + "/database_password.txt").toString();
const mysql = require("mysql");
const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: password
});

database.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + database.threadId);
});

module.exports = function () {

    this.database = database;

}