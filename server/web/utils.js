

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
    }

}