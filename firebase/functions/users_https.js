var bcrypt = require('bcrypt');
var crypto = require('crypto');

require('./utils.js')();
require('./users.js')();

module.exports = function(e) {

    // CHECK TOKENS
    e.checkTokens = functions.https.onRequest((request, response) => {

        var check = request.body.data.checkTokens;
        var results = {};
        var nChecked = 0;
        var nToCheck = 0;
        for (var u in check) nToCheck++;

        var callback = (username, valid) => {
            results[username] = valid;
            if (++nChecked === nToCheck)
                response.send({data: results});
        }
        for (var username in check)
            checkToken(username, check[username], callback)
    });

    // USER INFO
    e.getUserInfo = functions.https.onRequest((request, response) => {

        var usernames = request.body.data.getInfoFor;
        var allInfo = {};
        var saved = 0;

        var callback = info => {
            allInfo[info.username] = info;
            if (++saved === usernames.length)
                response.send({data: {success: true, info: allInfo}});
        }

        for (var i in usernames) {
            var username = usernames[i];
            getUserInfo(username, callback);
        }
    });

    // USER EXISTS
    e.userExists = functions.https.onRequest((request, response) => {

        var usernameLower = request.body.data.username.trim().toLowerCase();
        refValue(users.child(usernameLower), user => {
            response.send({data: {exists: user !== null}});
        });
    });

    // LOGIN
    e.login = functions.https.onRequest((request, response) => {

        var data = request.body.data;
        var username = data.username.trim();
        var usernameLower = username.toLowerCase();
        var password = data.password;

        if (username.length === 0)
            response.send({data: {error: "geef me je naam"}})
        else if (password.length === 0)
            response.send({data: {error: "geef me je wachtwoord"}})

        else refValue(users.child(usernameLower), user => {

            if (user === null)
                response.send({data: {error: username + " bestaat niet"}})
            else bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    console.log(err);
                    response.send({data: {error: "er is iets kapot"}});
                } else if (res)
                    sendLoginResponse(response, usernameLower);
                else
                    response.send({data: {error: "wachtword is hartstikke verkird"}});
            });
        });
    });

    // CREATE USER
    e.createUser = functions.https.onRequest((request, response) => {

        var data = request.body.data;
        // todo: prevent injection
        var username = data.username.trim();
        var usernameLower = username.toLowerCase();
        var password = data.password;
        var mail = data.mail;
        var color = data.color;

        if (username.length < 3) {
            response.send({data: {success: false, error: "Gebruiksnam mot langer dan 3 !"}})

        } else if (password.length < 3) {
            response.send({data: {error: "Das wel een hele korte wachtword"}})

        } else refValue(users.child(usernameLower), user => {

            if (user !== null)
                response.send({data: {error: user.username + " bestaat al"}})
            else {

                bcrypt.hash(password, 2, (err, hash) => {
                    if (err) {
                        console.log(err);
                        response.send({data: {error: "er is iets kapot"}});
                    } else {
                        users.child(usernameLower).set({username: username, password: hash});
                        sendLoginResponse(response, usernameLower);
                    }
                });
            }
        });
    });
}

function sendLoginResponse(response, usernameLower) {
    refValue(users.child(usernameLower), user => {
        response.send({data:
            {
                success: true,
                token: createToken(usernameLower),
                username: user.username
            }
        });
    });
}

function createToken(usernameLower) {
    var token = crypto.randomBytes(10).toString('hex');
    tokens.child(token).set({usernameLower: usernameLower, created: Date.now()});
    return token;
}
