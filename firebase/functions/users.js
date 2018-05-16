
require('./utils.js')();

module.exports = function() {

    this.users = database.ref("users");
    this.tokens = database.ref("tokens");

    this.getUserInfo = function(username, callback) {

        var usernameLower = username.toLowerCase();
        refValue(users.child(usernameLower), user => {

            if (user === null) {
                callback(null);
                return;
            }
            var info = {
                username: user.username,
                profilePic: null
            }
            callback(info);
        });
    }

}
