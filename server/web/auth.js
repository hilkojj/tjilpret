
const db = require("./database.js");
const utils = require("./utils.js");
const bcrypt = require("bcrypt");

module.exports = function(api) {

    api.post("/login", (req, res) => {

        var username = req.body.username;
        var password = req.body.password;

        if (typeof username != "string" || typeof password != "string") {
            utils.sendError(res, "Mag ik je gebruiksnam en wagtword weten pls?!?!");
            return;
        }

        db.connection.query("SELECT * FROM users WHERE username = ?", [username], (err, users, fields) => {
            if (err) {
                console.log(err);
                utils.sendError(res, "AAA er is iets mis gegaan!?!?! Sory..");
                return;
            }
            if (users.length == 0) {
                utils.sendError(res, "'" + username + "' bestaat niet. Heppie typaids ofzo?");
            } else bcrypt.compare(password, users[0].password, (err, correct) => {
                if (err) {
                    console.log(err);
                    utils.sendError(res, "RIP tjilpret. er is iets mis");
                    return;
                }
                if (!correct) {
                    utils.sendError(res, "Wachtwoord is niet goed, " + username + "!!");
                } else {

                    const user = users[0];
                    const token = utils.randomInt(100000000, 999999999);
                    db.connection.query("INSERT INTO tokens SET ?", {
                        token: token,
                        user_id: user.user_id,
                        created: Date.now() / 1000 | 0,
                        expires: 0
                    }, (err, rows, fields) => {
                        if (err) {
                            console.log(err);
                            utils.sendError(res, "Inlogsessie aanmaken mislukt........ neeee");
                            return;
                        }
                        res.send({
                            success: true,
                            token: token,
                            username: user.username
                        });
                    });
                }
            });
        });
    });

}