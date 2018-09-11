const db = require("../database");
const chatUtils = require("./chat-utils");

const connections = {};

class ChatConnection {

    constructor(socket, token, userId, username) {
        this.socket = socket;
        this.token = token;
        this.userId = userId;

        socket.emit("authenticated");

        if (userId in connections) connections[userId].push(this);
        else connections[userId] = [this];

        socket.on("send message", data => {

            console.log(data);
            sendMessage(data.chatId, userId, data.text);

        });

        socket.on("disconnect", () => {

            if (!(userId in connections)) return;

            var userConnections = connections[userId];
            if (userConnections.length == 1) delete connections[userId]
            else {
                var index = userConnections.indexOf(this);
                if (index > -1) connections[userId] = userConnections.splice(index, 1);
            }

            console.log(`Tjet verbinding met ${username} verbroken`);
        });
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

module.exports = {

    addMember, createEvent, sendMessage, addUserToPublicGroup,

    socketIO: io => {
        io.on("connection", socket => {

            console.log("Een ongeïdentificeerde tjiller is verbonden met de tjilpret tjet");

            socket.on("auth", data => {

                if (socket.auth) return socket.emit("already authenticated");

                var token = String(data.token);

                db.connection.query(`
                SELECT users.user_id, username FROM users
                JOIN tokens ON tokens.user_id = users.user_id
                WHERE token = ?
            `, [token], (err, rows, fields) => {

                        if (err) console.log(err);

                        if (!rows || !(0 in rows)) return socket.emit("invalid token");

                        var user = rows[0];
                        console.log(`De ongeïdentificeerde tjiller was ${user.username} maar`)

                        socket.auth = true;
                        new ChatConnection(socket, token, user.user_id | 0, user.username);
                    });

            });

        });
    }

}