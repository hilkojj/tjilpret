
const db = require("./database.js");
const utils = require("./utils.js");
const bcrypt = require("bcrypt");

var createSession = function (user, res) {
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
        console.log(user.username + " logged in!!! weeeeeeeeeeeeeeeeeeeeeeeeeee");
        res.send({
            success: true,
            token: token,
            userInfo: utils.userInfo(user)
        });
    });
}

module.exports = function (api) {

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
                createSession(users[0], res);
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
        } else if (password.length < 4) {
            utils.sendError(res, "Das wel een heel kort wachtwoord");
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
                    r: utils.randomInt(0, 230),
                    g: utils.randomInt(0, 230),
                    b: utils.randomInt(0, 230)
                }, (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return utils.sendError(res, "Potver dat ging helemaal mis. Probeer nog es?!?!");
                    }
                    const id = results.insertId;
                    db.connection.query("SELECT * FROM users WHERE user_id = ?", [id], (err, rows, fields) => {
                        if (err) {
                            console.log(err);
                            return utils.sendError(res, "Probeer nu es in te loggen");
                        }
                        createSession(rows[0], res);
                    });
                });
            });
        });
    });

}