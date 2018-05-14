var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var users = admin.database().ref("users");

module.exports = function(e) {

    // CREATE USER
    e.createUser = functions.https.onRequest((request, response) => {

        // todo: prevent injection
        var username = request.body.data.username.trim();
        var password = request.body.data.password;
        var color = request.body.data.color;

        if (username.length < 3) {

            response.send({data: {success: false, error: "Gebruiksnam mot langer dan 3 !"}})

        } else if (password.length < 3) {

            response.send({data: {error: "Das wel een hele korte wachtword"}})

        } getUser(username, user => {

            if (user !== null)
                response.send({data: {error: username + " bestaat al"}})
            else {

                users.push().set({username: username, password: password});

                response.send({data: {success: true}});
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
