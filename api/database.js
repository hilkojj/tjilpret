
const fs = require("fs");
const mysql = require("mysql");

// example file database-connection.json:
// {
//     "host": "tjilpret.tk",
//     "port": 123,
//     "user": "username",
//     "password": "password",
//     "database": "databasename"
// }

const connection = mysql.createConnection(

    Object.assign(
        JSON.parse(fs.readFileSync(__dirname + "/database-connection.json").toString()),
        {
            multipleStatements: true,
            charset: "utf8mb4"
        }
    )
);

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