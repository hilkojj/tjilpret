var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var users = admin.database().ref("users");

module.exports = function(e) {

    // USER EXISTS
    e.userExists = functions.https.onRequest((request, response) => {

        var data = request.body.data;
        var username = data.username.trim();
        getUser(username, user => {
            response.send({data: {exists: user !== null}});
        });
    });

    // LOGIN
    e.login = functions.https.onRequest((request, response) => {

        var data = request.body.data;
        var username = data.username.trim();
        var password = data.password;

        if (username.length === 0)
            response.send({data: {error: "geef me je naam"}})
        else if (password.length === 0)
            response.send({data: {error: "geef me je wachtwoord"}})

        else getUser(username, user => {

            if (user === null)
                response.send({data: {error: username + " bestaat niet"}})
            else if (user.password !== password)
                response.send({data: {error: "wachtword is hartstikke verkird"}})
            else
                response.send({data: {success: true, username: "username"}})
        });
    });

    // CREATE USER
    e.createUser = functions.https.onRequest((request, response) => {

        var data = request.body.data;
        // todo: prevent injection
        var username = data.username.trim();
        var password = data.password;
        var mail = data.mail;
        var color = data.color;

        if (username.length < 3) {
            response.send({data: {success: false, error: "Gebruiksnam mot langer dan 3 !"}})

        } else if (password.length < 3) {
            response.send({data: {error: "Das wel een hele korte wachtword"}})

        } else getUser(username, user => {

            if (user !== null)
                response.send({data: {error: username + " bestaat al"}})
            else {

                users.push().set({username: username, password: password});
                response.send({data: {success: true, username: username}});
            }
        });
    });

}

function getUser(username, callback) {

    users.once("value", snapshot => {
        var users = snapshot.val();
        for (var i in users) {
            var user = users[i];
            if (user.username === username) {
                callback(user);
                return;
            }
        }
        callback(null);
    });
}
