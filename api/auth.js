
const db = require("./database.js");
const utils = require("./utils.js");
const bcrypt = require("bcrypt");
const useragent = require('useragent');
const emoticons = require("./emoticons.js");
const chat = require("./chat/very-realtime");

var minPasswordLength = 4;

var createSession = function (user, req, res) {
    const token = utils.randomInt(10000000, 99999999);
    const userAgent = req.headers["user-agent"] || "unkown";
    db.connection.query("INSERT INTO tokens SET ?", {
        token: token,
        user_id: user.user_id,
        created: Date.now() / 1000 | 0,
        expires: 0,
        user_agent: userAgent,
        ip: req.headers["x-real-ip"] || "unkown"
    }, (err, rows, fields) => {
        if (err) {
            console.log(err);
            utils.sendError(res, "Inlogsessie aanmaken mislukt........ neeee");
            return;
        }
        var apple = userAgent.indexOf("Mac OS X") != -1 || userAgent.indexOf("iPhone") != -1;
        var userInfo = utils.userInfo(user);
        if (apple) userInfo.appleUser = true;

        console.log("Nieuwe token voor: " + user.username + "   " + Date());
        if (apple) console.log("(apple)");
        
        res.send({
            success: true,
            token: token,
            userInfo: userInfo
        });

        if (apple) {
            db.connection.query(`
                UPDATE users SET apple_user = 1 WHERE user_id = ?
            `, [user.user_id], (err, r, f) => {
                if (err) console.log(err);
            })
        }
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
            } else if (password.length < minPasswordLength) {
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

                bcrypt.hash(password, 2, async (err, encryptedPassword) => {

                    var id = await utils.createEntity(null, null);

                    db.connection.query("INSERT INTO users SET ?", {
                        user_id: id,
                        username: username,
                        password: encryptedPassword,
                        joined_on: Date.now() / 1000 | 0,
                        email: email,
                        bio: "nieuweling",
                        r: 94, g: 94, b: 255,
                        color_class_id: 14
                    }, (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            return utils.sendError(res, "Potver dat ging helemaal mis. Probeer nog es?!?!");
                        }
                        console.log(username + " heeft de verstandige keuze gemaakt om lid te worden van tjilpret");
                        
                        db.connection.query("SELECT * FROM user_info WHERE user_id = ?", [id], (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                return utils.sendError(res, "Probeer nu es in te loggen");
                            }
                            emoticons.createFriendshipWithEmoticonCollectionUser(id);
                            chat.addUserToPublicGroup(id, username);
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
                        token.partialToken = (token.token + "").substring(0, 4);
                        delete token.token;
                        var agent = useragent.parse(token.userAgent);
                        token.readableUserAgent = agent.toString().replace(" " + agent.toVersion(), "").replace(" 0.0.0", "");
                    }
                    res.send(tokens);
                }
            );
        });

        api.post("/logout", (req, res) => {
            var token = parseInt(req.body.token) || 0;
            var tokenToDelete = db.connection.escape(parseInt(req.body.partialToken) || token);
            db.connection.query(`
                SELECT user_id, token FROM tokens WHERE token LIKE "${tokenToDelete}%";

                DELETE FROM tokens 
                WHERE user_id = (SELECT user_id FROM (SELECT * FROM tokens) AS t WHERE token = ?)
                AND token LIKE "${tokenToDelete}%";`,
                [token], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    res.send({ success: results[1].affectedRows == 1 });

                    var row = results[0][0];
                    if (row) chat.disconnectUser(row.user_id, row.token);
                }
            );
        });

        api.post("/logoutEverywhere", (req, res) => {
            db.connection.query(`
                SELECT user_id FROM tokens WHERE token = ?`,
                [parseInt(req.body.token) || 0], (err, rows, fields) => {
                    if (err || !(0 in rows)) {
                        if (err) console.log(err);
                        return res.send({ success: false });
                    }
                    var userId = rows[0].user_id;
                    db.connection.query(`DELETE FROM tokens WHERE user_id = ?`,
                        [userId], (err, results, fields) => {
                            if (err) {
                                console.log(err);
                                return res.send({ success: false });
                            }
                            res.send({ success: true });
                            chat.disconnectUser(userId);
                        }
                    );
                }
            );
        });

        api.post("/changePassword", (req, res) => {

            var newPassword = req.body.newPassword;
            if (typeof newPassword != "string" || newPassword.length < minPasswordLength)
                return utils.sendError(res, "Wacgtwoord is te kort");

            db.connection.query(`SELECT username, users.user_id, password FROM users, tokens 
                                WHERE users.user_id = tokens.user_id AND token = ?`,
                [parseInt(req.body.token) || 0], (err, users, fields) => {
                    if (err || users.length == 0) {
                        if (err) console.log(err);
                        return utils.sendError(res, "AAA er is iets mis gegaan!?!?!");
                    }
                    var user = users[0];
                    bcrypt.compare(req.body.currentPassword || "", user.password, (err, correct) => {
                        if (err) {
                            console.log(err);
                            return utils.sendError(res, "RIP tjilpret. er is iets mis");
                        }
                        if (!correct)
                            return utils.sendError(res, "Huidige wagtwoord is niet goed >:(");

                        bcrypt.hash(newPassword, 2, (err, encryptedPassword) => {
                            db.connection.query("UPDATE users SET password = ? WHERE user_id = ?",
                                [encryptedPassword, user.user_id], (err, results, fields) => {
                                    if (err) {
                                        console.log(err);
                                        return utils.sendError(res, "Potver dat ging helemaal mis. Probeer nog es?!?!");
                                    }
                                    console.log(user.username + " heeft zyn wachtwword veranderd " + Date());
                                    res.send({ success: true });
                                }
                            );
                        });
                    });
                }
            );
        });

        api.post("/myEmail", (req, res) => {

            db.connection.query(`SELECT email FROM users, tokens 
            WHERE users.user_id = tokens.user_id AND token = ?`, [parseInt(req.body.token) || 0],
                (err, rows, fields) => {
                    if (err || rows.length == 0) {
                        if (err) console.log(err);
                        return utils.sendError(res, "AAA er is iets mis gegaan!?!?!");
                    }

                    res.send({ email: rows[0].email });
                }
            );
        });

        api.post("/changeEmail", (req, res) => {

            var newEmail = req.body.newEmail;

            if (!utils.validateEmail(newEmail || ""))
                return utils.sendError(res, "Ik denk dat dat een neppe email is >:( rotzak!");

            db.connection.query(`SELECT username, users.user_id, password FROM users, tokens 
                                WHERE users.user_id = tokens.user_id AND token = ?`,
                [parseInt(req.body.token) || 0], (err, users, fields) => {
                    if (err || users.length == 0) {
                        if (err) console.log(err);
                        return utils.sendError(res, "AAA er is iets mis gegaan!?!?!");
                    }
                    var user = users[0];
                    bcrypt.compare(req.body.password || "", user.password, (err, correct) => {
                        if (err) {
                            console.log(err);
                            return utils.sendError(res, "RIP tjilpret. er is iets mis");
                        }
                        if (!correct)
                            return utils.sendError(res, "Wagtwoord is niet goed >:(");

                        db.connection.query("UPDATE users SET email = ? WHERE user_id = ?",
                            [newEmail, user.user_id], (err, results, fields) => {
                                if (err) {
                                    console.log(err);
                                    return utils.sendError(res, "Potver dat ging helemaal mis. Probeer nog es?!?!");
                                }
                                console.log(user.username + " heeft zyn email veranderd " + Date());
                                res.send({ success: true });
                            }
                        );
                    });
                }
            );
        });
    }
}