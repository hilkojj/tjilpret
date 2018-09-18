const db = require("../database");
const chatUtils = require("./chat-utils");
const emoticons = require("../emoticons");
const push = require("./push");

db.connection.query(`UPDATE users SET online = 0`);

const connections = global.connections = {};

class AuthConnection {

    constructor(socket, token, userId, username) {
        this.socket = socket;
        this.token = token;
        this.userId = userId;
        this.dontPushAnything = false;
        this.dontPushChatIds = [];

        socket.emit("authenticated");
        this.addToConnections();

        socket.on("send message", async data => {

            var chatId = parseInt(data.chatId) || -1;
            var text = String(data.text);
            if (text && await chatUtils.isMember(userId, chatId))
                sendMessage(chatId, userId, text);
            else socket.emit("exception", text ? "you are not a member of this chat" : "no text");

        });

        socket.on("dont push", data => {
            this.dontPushAnything = data.anything ? true : false;
            if (Array.isArray(data.chatIds) && !data.chatIds.some(isNaN))
                this.dontPushChatIds = data.chatIds;
        });

        socket.on("set muted", data => {
            var chatId = data.chatId;
            var muted = data.muted ? true : false;
            if (isNaN(chatId)) return;
            db.connection.query(
                `UPDATE chat_members SET muted = ? WHERE user_id = ? AND chat_id = ?`,
                [muted, this.userId, chatId]
            );
            forConnectionOfUser(this.userId, conn => conn.socket.emit("muted", { chatId, muted }));
        });

        socket.on("set admin", data => {

            var chatId = parseInt(data.chatId) || -1;
            var memberId = parseInt(data.memberId) || -1;
            if (memberId == this.userId) return socket.emit("exception", "cannot (de)op yourself");

            var admin = data.admin ? true : false;
            db.connection.query(
                `UPDATE chat_members who
                JOIN chat_members byy ON byy.user_id = ? AND byy.chat_id = ?
                SET who.is_chat_admin = ?
                WHERE who.chat_id = ? AND who.user_id = ? AND byy.is_chat_admin`,
                [this.userId, chatId, admin, chatId, memberId], (err, results) => {
                    if ((!err || console.log(err)) && results.affectedRows == 1)
                        createEvent(chatId, admin ? "OPPED" : "DEOPPED", this.userId, memberId);
                }
            );
        });

        socket.on("remove member", data => {
            var chatId = parseInt(data.chatId) || -1;
            var memberId = parseInt(data.memberId) || -1;
            if (memberId == this.userId) return socket.emit("exception", "cannot remove yourself (leave group instead)");

            var timestamp = Date.now();
            db.connection.query(
                `UPDATE chat_members who
                JOIN chat_members byy ON byy.user_id = ? AND byy.chat_id = ?
                SET who.left_timestamp = ?
                WHERE who.chat_id = ? AND who.user_id = ? AND byy.is_chat_admin AND who.left_timestamp IS NULL`,
                [this.userId, chatId, timestamp, chatId, memberId], (err, results) => {
                    if ((!err || console.log(err)) && results.affectedRows == 1)
                        createEvent(chatId, "USER_REMOVED", this.userId, memberId, timestamp - 1);
                }
            );
        });

        socket.on("leave group", data => {
            var chatId = parseInt(data.chatId) || -1;

            var timestamp = Date.now();
            db.connection.query(
                `UPDATE chat_members leaver
                
                LEFT JOIN chat_members chat_admin ON (
                    leaver.chat_id = chat_admin.chat_id
                    AND
                    chat_admin.left_timestamp IS NULL
                    AND
                    chat_admin.is_chat_admin
                    AND
                    chat_admin.user_id != leaver.user_id
                )

                JOIN chats groupp ON groupp.is_group AND groupp.chat_id = leaver.chat_id
                
                SET leaver.left_timestamp = ?
                WHERE leaver.user_id = ? AND leaver.chat_id = ? 
                
                # leaver is currently a member
                AND leaver.left_timestamp IS NULL

                # leaver is not a chat admin OR is not the only chat admin:
                AND (!leaver.is_chat_admin OR (leaver.is_chat_admin AND chat_admin.user_id IS NOT NULL))`,
                [timestamp, this.userId, chatId], (err, results) => {
                    if ((!err || console.log(err)) && results.affectedRows == 1)
                        createEvent(chatId, "USER_LEFT", null, this.userId, timestamp - 1);
                }
            );
        });

        socket.on("disconnect", () => {

            this.removeFromConnections();
            console.log(`Tjet verbinding met ${username} verbroken`);
        });

        socket.on("online", () => this.toggleOnline(true));
        socket.on("offline", () => this.toggleOnline(false));

        socket.removeAllListeners("auth");
        socket.on("auth", () => socket.emit("already authenticated"));
    }

    addToConnections() {
        if (this.userId in connections) connections[this.userId].push(this);
        else connections[this.userId] = [this];
    }

    removeFromConnections() {
        if (!(this.userId in connections)) return;

        var userConnections = connections[this.userId];
        if (userConnections.length == 1) delete connections[this.userId]
        else {
            var index = userConnections.indexOf(this);
            if (index > -1) connections[this.userId] = userConnections.splice(index, 1);
        }
        this.toggleOnline(false);
    }

    toggleOnline(online) {
        var timestamp = Date.now() / 1000 | 0;
        db.connection.query(
            `UPDATE users SET online = ?, last_activity = ? WHERE user_id = ?`,
            [online, timestamp, this.userId], err => err && console.log(err)
        );
        forConnectionOfCoMembers(this.userId, conn => conn.socket.emit(online ? "online" : "offline", {
            userId: this.userId,
            lastActivity: timestamp
        }));
    }

}
const addMember = (chatId, userId, addedByUserId) => {

    db.connection.query(`
        INSERT INTO chat_members (chat_id, user_id, joined_timestamp)
        SELECT chat_id, ?, ? FROM chat_members
        WHERE user_id = ? AND is_chat_admin AND chat_id = ?
    `, [userId, Date.now(), addedByUserId, chatId], (err, results, fields) => {

            if (err) console.log(err);

            else if (results.affectedRows == 1) createEvent(chatId, "USER_ADDED", addedByUserId, userId);
        });
}

const createEvent = (chatId, type, by, who, timestamp) => {

    if (!timestamp) timestamp = Date.now();

    db.connection.query(`
        INSERT INTO chat_events SET ?;
        SELECT user_id, username FROM users WHERE user_id = ? OR user_id = ?;
        SELECT group_title FROM chats WHERE chat_id = ?
    `, [{ chat_id: chatId, type, timestamp, by, who }, by || -1, who || -1, chatId], (err, results) => {

            if (err) {
                return console.log(err);
            }

            if (results[0].affectedRows == 0) return;

            var byUsername = null;
            var whoUsername = null;

            for (var row of results[1]) {
                if (row.user_id == by) byUsername = row.username;
                else if (row.user_id == who) whoUsername = row.username;
            }

            var event = {
                id: results[0].insertId,
                chatId: chatId,
                groupTitle: results[2][0].group_title,
                type, timestamp,
                by, who,
                byUsername,
                whoUsername
            };

            var cb = conn => conn.socket.emit("event", event);
            forEachConnectionOfMembers(chatId, cb);
            // also send event to user who just left/was removed:
            if (type == "USER_REMOVED" || type == "USER_LEFT") forConnectionOfUser(who, cb);
        }
    );
}

const sendMessage = (chatId, userId, text) => {

    db.connection.query(`
        INSERT INTO messages SET ?
    `, {
            chat_id: chatId, sent_by: userId, sent_timestamp: Date.now(), text
        }, async (err, results) => {

            if (err) {
                console.log(err);
                return;
            }
            if (results.affectedRows == 0) return;

            let message = await chatUtils.getMessage(results.insertId);
            if (message) forConnectionOrSubscriptionOfMembers(
                chatId, message.sentBy,

                conn => conn.socket.emit("message", message),

                sub => !sub.muted && push.triggerPushMsg(sub, { message })
            );
            emoticons.registerEmoticonUses(message.text);
        }
    );
}

const forConnectionOfUser = (userId, callback) => userId in connections && connections[userId].forEach(callback);

const forConnectionOfCoMembers = async (userId, callback) => {

    (await chatUtils.getCoMemberIds(userId)).forEach(memberId => {
        var memberConnections = connections[memberId];
        if (memberConnections) memberConnections.forEach(callback);
    });
}

const forEachConnectionOfMembers = async (chatId, callback) => {

    (await chatUtils.getMemberIds(chatId)).forEach(memberId => {
        var memberConnections = connections[memberId];
        if (memberConnections) memberConnections.forEach(callback);
    });
}

const forConnectionOrSubscriptionOfMembers = async (chatId, ignoreSubsOf, connectionCallback, subscriptionCallback) => {

    var subs = await chatUtils.getMemberSubscriptions(chatId);
    for (var memberId in subs) {

        var memberConnections = connections[memberId];
        var dontPush = memberId == ignoreSubsOf;

        if (memberConnections) for (var conn of memberConnections) {

            if (conn.dontPushAnything || conn.dontPushChatIds.includes(chatId))
                dontPush = true;

            connectionCallback(conn);
        }

        if (dontPush) continue;
        var memberSubs = subs[memberId];
        if (memberSubs) memberSubs.forEach(subscriptionCallback);
    }
}

const publicGroupId = 305;
const userThatAddsNewUsersToPublicGroup = 1157;

const addUserToPublicGroup = (userId, username) => {
    addMember(publicGroupId, userId, userThatAddsNewUsersToPublicGroup);
    setTimeout(() => {

        sendMessage(
            publicGroupId, userThatAddsNewUsersToPublicGroup,
            `Gegroet tjetters en tjillers,\n\n`
            + `Vandaag heeft *${username}* de stap gezet om lid te worden van Tjilpret,\n`
            + `opdat hij/zij mag delen in het volle genot dat Tjilpret ons allen te geven heeft.\n`
            + `hij/zij wordt hierbij toegelaten tot het *tjatlowkaal* en draagt medeverantwoordelijkheid voor opbouw en onderhoud van deze tjet.`
        );
    }, 1000);
}

const disconnectUser = (userId, token) => {
    var userConnections = connections[userId];
    if (!userConnections) return;

    for (var conn of userConnections) {
        if (token && conn.token + "" != token + "") continue;

        conn.socket.emit("logged out");
        conn.removeFromConnections();
        conn.socket.disconnect();
    }
}

module.exports = {

    addMember, createEvent, sendMessage, addUserToPublicGroup,
    disconnectUser,

    socketIO: io => {
        io.on("connection", socket => {

            socket.on("auth", data => {

                var token = String(data.token);

                db.connection.query(`
                SELECT users.user_id, username FROM users
                JOIN tokens ON tokens.user_id = users.user_id
                WHERE token = ?
            `, [token], (err, rows, fields) => {

                        if (err) console.log(err);

                        if (!rows || !(0 in rows)) return socket.emit("invalid token");

                        var user = rows[0];
                        console.log(`Tjetverbinding met ${user.username}`);

                        new AuthConnection(socket, token, user.user_id | 0, user.username);
                    }
                );
            });

        });
    }

}