
const db = require("./database.js");
const utils = require("./utils.js");

module.exports = function (api) {

    api.post("/userInfo", (req, res) => {
        db.connection.query("SELECT * FROM users WHERE username = ?", [req.body.username], (err, rows, fields) => {
            if (err || rows.length == 0) {
                if (err) console.log(err);
                res.send({found: false});
            } else res.send({found: true, userInfo: utils.userInfo(rows[0])});
        });;
    });

}