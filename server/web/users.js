
const db = require("./database.js");
const utils = require("./utils.js");

module.exports = function (api) {

    api.post("/userInfo", (req, res) => {

        var callback = (err, rows, fields) => {
            if (err || rows.length == 0) {
                if (err) console.log(err);
                res.send({found: false});
            } else res.send({found: true, userInfo: utils.userInfo(rows[0])});
        }

        if ("id" in req.body)
            db.connection.query("SELECT * FROM user_info WHERE user_id = ?", [req.body.id], callback);
        else if ("username" in req.body) 
            db.connection.query("SELECT * FROM user_info WHERE username = ?", [req.body.username], callback);
        else res.send({found: false, reason: "no id or username given"})
    });

}