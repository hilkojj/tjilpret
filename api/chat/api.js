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

}

module.exports = {
    apiFunctions
}