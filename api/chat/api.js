const db = require("../database");
const fs = require("fs");
const utils = require("../utils");
const chatUtils = require("./chat-utils");

const apiFunctions = api => {

    const conversationsQuery = fs.readFileSync(__dirname + "/queries/conversations.sql").toString();
    api.post("/conversations", (req, res) => {

        db.connection.query(conversationsQuery, [parseInt(req.body.token) || 0], (err, rows, fields) => {

            if (err) {
                console.log(err);
                return utils.sendError(res, "Er ging iets mis.");
            }

            const conversations = [];

            for (var row of rows) conversations.push(chatUtils.conversation(row));
            res.send(conversations);
        });
    });

    const messagesQuery = fs.readFileSync(__dirname + "/queries/messages.sql").toString();
    const eventsQuery = fs.readFileSync(__dirname + "/queries/events.sql").toString();
    api.post("/messagesAndEvents", (req, res) => {

        var chatId = parseInt(req.body.chatId) || 0;
        var until = parseInt(req.body.until) || Date.now();
        var token = parseInt(req.body.token) || 0;

        if (!token) return utils.sendError(res, "No token given");

        db.connection.query(messagesQuery, [
            chatId,
            until,
            token,
            parseInt(req.body.limit) || 64
        ], (err, rows, fields) => {

            if (err) {
                console.log(err);
                return utils.sendError(res, "Er ging iets mis.");
            }

            const messagesAndEvents = [];
            for (var row of rows) messagesAndEvents.push({
                message: chatUtils.message(row)
            });

            if (messagesAndEvents[0]) db.connection.query(eventsQuery, [
                chatId,
                messagesAndEvents[0].message.sentTimestamp,
                until,
                token
            ], (err, rows, fields) => {

                if (err) console.log(err);

                if (rows) for (var row of rows) messagesAndEvents.push({
                    event: chatUtils.event(row)
                });
                res.send(messagesAndEvents);
            });
            else res.send(messagesAndEvents);
        });
    });

    api.post("/chatWallpaperUrl", (req, res) => {

        db.connection.query(`
            SELECT wallpaper FROM users
            JOIN tokens ON users.user_id = tokens.user_id AND token = ?
        `, [parseInt(req.body.token) || 0], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return utils.sendError(res, "Er ging iets mis.");
                }
                if (rows.length == 0) return utils.sendError(res, "Wrong token");
                var row = rows[0];
                res.send({ url: (row.wallpaper ? "https://tjilpret.tk/private_content/chat_wallpaper/" + row.wallpaper : null) });
            }
        );
    });

}

module.exports = {
    apiFunctions
}