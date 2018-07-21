
const db = require("./database.js");

module.exports = {

    createEntity: function (userId, token, callback) {

        const sqlCallback = (err, results, fields) => {
            if (err) {
                console.log("error while creating entity", err);
                return callback(null);
            }
            callback(results.insertId);
        };

        if (token)
            db.connection.query("INSERT INTO entities (user_id) VALUES ((SELECT user_id FROM tokens WHERE token = ?))",
                [token], sqlCallback
            );
        else if (userId)
            db.connection.query("INSERT INTO entities SET ?", { user_id: userId }, sqlCallback);
        else
            db.connection.query("INSERT INTO entities () VALUES ()", {}, sqlCallback);

    },

    removeExtraNewlines: function (text) {
        return text.replace(/\n\s*\n\s*\n/g, '\n\n');
    },

    sendError: function (res, errorMessage) {

        res.send({ error: errorMessage });
    },

    randomString: function (length) {

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    userInfo: function (row) {
        return {
            id: row.user_id,
            username: row.username,
            bio: row.bio,
            admin: row.is_admin == 1,
            lastActivity: row.last_activity || 0,
            online: row.online == 1,
            appleUser: row.apple_user == 1,
            r: row.r, g: row.g, b: row.b,
            profilePic: row.profile_pic,
            header: row.header,
            soundFragment: row.sound_fragment,
            friends: row.friends,
            uploads: row.uploads,
            groups: row.groups,
            messages: row.messages,
            rep: row.rep,
            views: row.views,
            comments: row.comments,
            groupsStarted: row.groups_started,
            joinedOn: row.joined_on,
            colorClassID: row.color_class_id
        }
    },

    validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    usernameExists: function (username, callback) {
        db.connection.query("SELECT COUNT(*) > 0 AS existss FROM users WHERE username = ?", [username], (err, rows, fields) => {
            if (err) {
                console.log(err);
                return callback(false);
            } else return callback(rows[0].existss);
        });
    }

}