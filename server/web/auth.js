
const db = require("./database.js");
const utils = require("./utils.js");
const bcrypt = require("bcrypt");
const useragent = require('useragent');

var createSession = function (user, req, res) {
    const token = utils.randomInt(100000000, 999999999);
    db.connection.query("INSERT INTO tokens SET ?", {
        token: token,
        user_id: user.user_id,
        created: Date.now() / 1000 | 0,
        expires: 0,
        user_agent: req.headers["user-agent"] || "unkown",
        ip: req.headers["x-real-ip"] || "unkown"
    }, (err, rows, fields) => {
        if (err) {
            console.log(err);
            utils.sendError(res, "Inlogsessie aanmaken mislukt........ neeee");
            return;
        }
        console.log("Nieuwe token voor " + user.username + "   " + Date());
        res.send({
            success: true,
            token: token,
            userInfo: utils.userInfo(user)
        });
    });
}

module.exports = {

    apiFunctions: function (api) {

        api.post("/login", (req, res) => {

            var username = req.body.username;
            var password = req.body.password;

            if (typeof username != "string" || typeof password != "string") {
                utils.sendError(res, "Mag ik je gebruiksnam en wagtword weten pls?!?!");
                return;
            }

            db.connection.query("SELECT * FROM user_info WHERE username = ?", [username], (err, users, fields) => {
                if (err) {
                    console.log(err);
                    return utils.sendError(res, "AAA er is iets mis gegaan!?!?! Sory..");
                }
                if (users.length == 0)
                    return utils.sendError(res, "'" + username + "' bestaat niet. Heppie typaids ofzo?");

                bcrypt.compare(password, users[0].password, (err, correct) => {
                    if (err) {
                        console.log(err);
                        return utils.sendError(res, "RIP tjilpret. er is iets mis");
                    }
                    if (!correct)
                        return utils.sendError(res, "Wachtwoord is niet goed, " + username + "!!");
                    createSession(users[0], req, res);
                });
            });
        });

        api.post("/register", (req, res) => {

            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;

            if (typeof username != "string" || typeof password != "string" || typeof email != "string")
                return utils.sendError(res, "Vul alles ff in pls");

            if (username.length < 3) {
                utils.sendError(res, "Gebriukesnaam moet minimal 3 tekens lang");
            } else if (username.length >= 45) {
                utils.sendError(res, "Gebriukesnaam mag maximaal 45 tekens lang");
            } else if (password.length < 4) {
                utils.sendError(res, "Das wel een heel kort wachtwoord");
            } else if (password.length >= 250) {
                utils.sendError(res, "Das echt een fkng lang wachtwoord");
            } else if (email.length >= 250) {
                utils.sendError(res, "je email adres is vilste lang");
            } else if (!utils.validateEmail(email)) {
                utils.sendError(res, "Ik denk dat dat een neppe email is >:( rotzak!");
            } else utils.usernameExists(username, (exists) => {
                if (exists)
                    return utils.sendError(res, "'" + username + "' bestaat al. Ik wil je vriendelijk vragen om orgineler te zijn.");

                bcrypt.hash(password, 2, (err, encryptedPassword) => {
                    db.connection.query("INSERT INTO users SET ?", {
                        username: username,
                        password: encryptedPassword,
                        joined_on: Date.now() / 1000 | 0,
                        email: email,
                        bio: "nieuweling",
                        r: 94, g: 94, b: 255,
                        color_class_id: 14
                    }, (err, results, fields) => {
                        console.log(username + " heeft de verstandige keuze gemaakt om lid te worden van tjilpret");
                        if (err) {
                            console.log(err);
                            return utils.sendError(res, "Potver dat ging helemaal mis. Probeer nog es?!?!");
                        }
                        const id = results.insertId;
                        db.connection.query("SELECT * FROM user_info WHERE user_id = ?", [id], (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                return utils.sendError(res, "Probeer nu es in te loggen");
                            }
                            createSession(rows[0], req, res);
                        });
                    });
                });
            });
        });

        api.post("/userNameExists", (req, res) => {
            utils.usernameExists(req.body.username, (exists) => {
                res.send({ exists: exists == 1 });
            });
        });

        api.post("/validateTokens", (req, res) => {
            const tokens = req.body.tokens;
            var query = "SELECT user_info.* FROM tokens JOIN user_info ON (tokens.user_id = user_info.user_id) WHERE "
            var i = 0;
            for (var userID in tokens) {
                if (++i == 40) break;

                var token = parseInt(tokens[userID]);
                var userID = parseInt(userID);
                query += (i != 1 ? " OR " : "") + "(tokens.user_id = " + userID + " AND tokens.token = " + token + ")"
            }
            if (i == 0) return res.send({});

            db.connection.query(query, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.send({});
                }
                const valid = {};
                for (var j in rows) {
                    const user = rows[j];
                    valid[user.user_id] = utils.userInfo(user);
                }
                res.send(valid);
            });
        });

        api.post("/tokenHistory", (req, res) => {
            db.connection.query(`
                SELECT token, created, user_agent AS userAgent, ip 
                FROM tokens 
                WHERE user_id = (SELECT user_id FROM tokens WHERE token = ?)
                ORDER BY created DESC`,
                [parseInt(req.body.token) || 0], (err, tokens, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send([]);
                    }
                    for (var i in tokens) {
                        var token = tokens[i];
                        token["readableUserAgent"] = useragent.parse(token.userAgent).toString();
                    }
                    res.send(tokens);
                }
            );
        });

        api.post("/logout", (req, res) => {
            db.connection.query(`DELETE FROM tokens WHERE token = ?`,
                [parseInt(req.body.token) || 0], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    res.send({ success: results.affectedRows == 1 });
                }
            );
        });

        api.post("/logoutEverywhere", (req, res) => {
            db.connection.query(`
                SELECT user_id FROM tokens WHERE token = ?`,
                [parseInt(req.body.token) || 0], (err, rows, fields) => {
                    if (err || !(0 in rows)) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    db.connection.query(`DELETE FROM tokens WHERE user_id = ?`,
                        [rows[0].user_id], (err, results, fields) => {
                            if (err) {
                                console.log(err);
                                return res.send({ success: false });
                            }
                            res.send({ success: true });
                        }
                    );
                }
            );
        });

    }
}