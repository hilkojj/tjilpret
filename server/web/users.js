
const db = require("./database.js");
const utils = require("./utils.js");

module.exports = {

    apiFunctions: function (api) {

        api.post("/userInfo", (req, res) => {

            var callback = (err, rows, fields) => {
                if (err || rows.length == 0) {
                    if (err) console.log(err);
                    res.send({ found: false });
                } else res.send({ found: true, userInfo: utils.userInfo(rows[0]) });
            }

            if ("id" in req.body)
                db.connection.query("SELECT * FROM user_info WHERE user_id = ?", [req.body.id], callback);
            else if ("username" in req.body)
                db.connection.query("SELECT * FROM user_info WHERE username = ?", [req.body.username], callback);
            else res.send({ found: false, reason: "no id or username given" })
        });

        api.post("/friendsOf", (req, res) => {
            var userID = parseInt(req.body.userID);
            db.connection.query(`
                SELECT * FROM users AS u
                JOIN friendships AS fs ON (
                    (u.user_id = fs.inviter_id AND NOT u.user_id = ?)
                    OR 
                    (u.user_id = fs.accepter_id AND NOT u.user_id = ?)
                )
                WHERE fs.inviter_id = ? OR fs.accepter_id = ?;`, [userID, userID, userID, userID],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send([]);
                    }
                    var friends = [];
                    for (var i in rows) friends.push(utils.userInfo(rows[i]));
                    res.send(friends);
                }
            );
        });

    }

}