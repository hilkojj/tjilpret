

module.exports = {

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

    userInfo: function(row) {
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
            header: row.header
        }
    }

}