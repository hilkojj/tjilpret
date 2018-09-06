const db = require("../database.js");

const connections = {};

const connection = (socket, token, userId, username) => {
    
    this.socket = socket;
    this.token = token;
    this.userId = userId;

    socket.emit("connected");

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

const sendMessage = (chatId, userId, text) => {

    

}

module.exports = io => {
    io.on("connection", socket => {

        console.log("Een ongeïdentificeerde tjiller is verbonden met de tjilpret tjet");
    
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
                console.log(`De ongeïdentificeerde tjiller was ${user.username} maar`)

                connection(socket, token, user.user_id | 0, user.username);
            });

        });
    
    });
};