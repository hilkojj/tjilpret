const db = require("../database");
const chatUtils = require("./chat-utils");
const emoticons = require("../emoticons");

const connections = global.connections = {};

class AuthConnection {

    constructor(socket, token, userId, username) {
        this.socket = socket;
        this.token = token;
        this.userId = userId;

        socket.emit("authenticated");
        this.addToConnections();

        socket.on("send message", async data => {

            var chatId = parseInt(data.chatId) || -1;
            var text = String(data.text);
            if (text && await chatUtils.isMember(userId, chatId))
                sendMessage(chatId, userId, text);
            else socket.emit("exception", text ? "you are not a member of this chat" : "no text");

        });

        socket.on("disconnect", () => {

            this.removeFromConnections();
            console.log(`Tjet verbinding met ${username} verbroken`);
        });

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
    }

}
const addMember = (chatId, userId, addedByUserId) => {

    db.connection.query(`
        INSERT INTO chat_members (chat_id, user_id, joined_timestamp)
        SELECT chat_id, ?, ? FROM chat_members
        WHERE user_id = ? AND is_chat_admin AND chat_id = ?
    `, [userId, Date.now() / 1000 | 0, addedByUserId, chatId], (err, results, fields) => {

            if (err) console.log(err);

            else if (results.affectedRows == 1) createEvent(chatId, "USER_ADDED", addedByUserId, userId);
        });
}

const createEvent = (chatId, type, by, who) => {

    var timestamp = Date.now();

    db.connection.query(`
        INSERT INTO chat_events SET ?;
        SELECT user_id, username FROM users WHERE user_id = ? OR user_id = ?;
    `, [{ chat_id: chatId, type, timestamp, by, who }, by || -1, who || -1], (err, results) => {

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

            forEachConnectionOfMembers(chatId, conn => conn.socket.emit("event", {
                id: results[0].insertId,
                chatId: chatId,
                type, timestamp,
                by, who,
                byUsername,
                whoUsername
            }));
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
            if (message) forEachConnectionOfMembers(chatId, conn => {
                conn.socket.emit("message", message);
            });
            emoticons.registerEmoticonUses(message.text);
        }
    );
}

const forEachConnectionOfMembers = async (chatId, callback) => {

    (await chatUtils.getMemberIds(chatId)).forEach(memberId => {
        var memberConnections = connections[memberId];
        if (memberConnections) memberConnections.forEach(callback);
    });
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