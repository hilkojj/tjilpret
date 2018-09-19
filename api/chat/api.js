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

            rowsLoop:
            for (var row of rows) {
                var newConv = chatUtils.conversation(row);

                for (var i in conversations) {
                    var conv = conversations[i];
                    if (conv.chatId != newConv.chatId) continue;

                    if (newConv.leftTimestamp == null || newConv.leftTimestamp > conv.leftTimestamp)
                        conversations[i] = newConv;

                    continue rowsLoop;
                }
                conversations.push(newConv);
            }
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

    api.post("/chatMembers", (req, res) => {

        db.connection.query(`
            SELECT 
                member.user_id, username, profile_pic, r, g, b, online, last_activity, member.is_chat_admin
            FROM chat_members requesting_member
            JOIN tokens ON token = ? AND tokens.user_id = requesting_member.user_id
            
            JOIN chat_members member ON member.chat_id = requesting_member.chat_id AND member.left_timestamp IS NULL
            JOIN users user ON member.user_id = user.user_id
            
            WHERE requesting_member.chat_id = ? AND requesting_member.left_timestamp IS NULL
        `, [parseInt(req.body.token) || 0, parseInt(req.body.chatId) || 0], (err, rows) => {
                if (err) {
                    console.log(err);
                    return utils.sendError(res, "error");
                }
                var chatAdmins = [];
                var members = [];
                for (var row of rows) {
                    if (row.is_chat_admin) chatAdmins.push(row.user_id);
                    members.push({
                        id: row.user_id,
                        username: row.username,
                        r: row.r, g: row.g, b: row.b,
                        profilePic: row.profile_pic,
                        online: row.online, lastActivity: row.last_activity
                    });
                }
                res.send({ members, chatAdmins });
            }
        );

    });

}

module.exports = {
    apiFunctions
}