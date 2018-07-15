
const db = require("./database.js");
const utils = require("./utils.js");

module.exports = {

    apiFunctions: function (api) {

        api.post("/userInfo", (req, res) => {

            var callback = (err, rows, fields) => {
                if (err || rows.length == 0) {
                    if (err) console.log(err);
                    res.send({ found: false });
                } else res.send({ found: true, userInfo: utils.userInfo(rows[0]) });
            }

            if ("id" in req.body)
                db.connection.query("SELECT * FROM user_info WHERE user_id = ?", [req.body.id], callback);
            else if ("username" in req.body)
                db.connection.query("SELECT * FROM user_info WHERE username = ?", [req.body.username], callback);
            else res.send({ found: false, reason: "no id or username given" })
        });

        api.post("/friendsOf/:userID", (req, res) => {
            var userID = parseInt(req.params.userID);

            var pageLimit = 8;
            var page = parseInt(req.body.page) || 0;
            db.connection.query(`
                SELECT * FROM users AS u
                JOIN friendships AS fs ON (
                    (u.user_id = fs.inviter_id AND NOT u.user_id = ?)
                    OR 
                    (u.user_id = fs.accepter_id AND NOT u.user_id = ?)
                )
                WHERE (fs.inviter_id = ? OR fs.accepter_id = ?)
                AND u.username LIKE CONCAT("%", ?, "%")
                ORDER BY since DESC
                LIMIT ? OFFSET ?;`, [userID, userID, userID, userID, req.body.q, pageLimit, page * pageLimit],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send([]);
                    }
                    var friends = [];
                    for (var i in rows) friends.push(utils.userInfo(rows[i]));
                    res.send(friends);
                }
            );
        });

        api.post("/myFriendsAndInvites", (req, res) => {
            var token = parseInt(req.body.token);
            db.connection.query(`
                    SELECT
                        IF (inviter_id = user_id, accepter_id, inviter_id) AS friend_id,
                        since,
                        IF (inviter_id = user_id, 1, 0) AS inviter
                    FROM friendships
                    JOIN tokens ON (tokens.user_id = inviter_id OR tokens.user_id = accepter_id)
                    WHERE token = ?;
                    
                    SELECT user_info.*, inviter_id, time FROM friend_invites
                    JOIN tokens ON (tokens.user_id = invited_id)
                    JOIN user_info ON (user_info.user_id = inviter_id)
                    WHERE token = ?;
                    
                    SELECT user_info.*, invited_id, time FROM friend_invites
                    JOIN tokens ON (tokens.user_id = inviter_id)
                    JOIN user_info ON (user_info.user_id = invited_id)
                    WHERE token = ?;`,
                [token, token, token],
                (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({});
                    }
                    var friends = {};
                    var receivedInvites = {};
                    var sentInvites = {};

                    var friendRows = results[0];
                    for (i in friendRows) {
                        var row = friendRows[i];
                        friends[row["friend_id"]] = { since: row["since"], inviter: row["inviter"] == 1 };
                    }
                    var receivedRows = results[1];
                    for (i in receivedRows) {
                        var row = receivedRows[i];
                        receivedInvites[row["inviter_id"]] = { time: row["time"], userInfo: utils.userInfo(row) };
                    }
                    var sentRows = results[2];
                    for (i in sentRows) {
                        var row = sentRows[i];
                        sentInvites[row["invited_id"]] = { time: row["time"], userInfo: utils.userInfo(row) };
                    }
                    res.send({ friends, receivedInvites, sentInvites });
                }
            );
        });

        api.post("/invite", (req, res) => {
            var invitedID = parseInt(req.body.invitedID);
            var token = parseInt(req.body.token);
            db.connection.query(`
                    INSERT INTO friend_invites
                    SELECT tokens.user_id, ?, ? FROM tokens
                    WHERE tokens.token = ?
                    AND 
                    (
                        SELECT COUNT(*) FROM friend_invites 
                        WHERE 
                            (inviter_id = tokens.user_id AND invited_id = ?)
                        OR
                            (inviter_id = ? AND invited_id = tokens.user_id)
                    ) = 0
                    AND 
                    (
                        SELECT COUNT(*) FROM friendships
                        WHERE
                            (inviter_id = tokens.user_id AND accepter_id = ?)
                        OR
                            (inviter_id = ? AND accepter_id = tokens.user_id)
                    ) = 0`,
                [invitedID, Date.now() / 1000 | 0, token, invitedID, invitedID, invitedID, invitedID],
                (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    res.send({ success: results.affectedRows == 1 });
                }
            );
        });

        api.post("/undoInvite", (req, res) => {
            var invitedID = parseInt(req.body.invitedID);
            var token = parseInt(req.body.token);
            db.connection.query(`
                    DELETE FROM friend_invites
                    WHERE invited_id = ? 
                      AND inviter_id = (SELECT tokens.user_id FROM tokens WHERE tokens.token = ?)`,
                [invitedID, token],
                (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    res.send({ success: results.affectedRows == 1 });
                }
            );
        });

        api.post("/confirmFriendship", (req, res) => {
            var inviterID = parseInt(req.body.inviterID);
            var token = parseInt(req.body.token);
            db.connection.query(`
                    DELETE FROM friend_invites
                    WHERE inviter_id = ? 
                      AND invited_id = (SELECT tokens.user_id FROM tokens WHERE tokens.token = ?)`,
                [inviterID, token],
                (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    var deleted = results.affectedRows == 1;
                    if (deleted && (req.body.accept == "true") || req.body.accept == true) {
                        db.connection.query(`
                            INSERT INTO friendships (accepter_id, inviter_id, since)
                            VALUES ((SELECT tokens.user_id FROM tokens WHERE tokens.token = ?), ?, ?)
                            `,
                            [token, inviterID, Date.now() / 1000 | 0],
                            (err, results, fields) => {
                                if (err) {
                                    console.log(err);
                                    return res.send({ success: false });
                                }
                                res.send({ success: true });
                            });
                    } else res.send({ success: deleted });
                }
            );
        });

        api.post("/removeFriend", (req, res) => {
            var friendID = parseInt(req.body.friendID);
            var token = parseInt(req.body.token);
            db.connection.query(`
                    DELETE FROM friendships
                    WHERE 
                        (inviter_id = ? AND accepter_id = (SELECT tokens.user_id FROM tokens WHERE tokens.token = ?))
                    OR
                        (accepter_id = ? AND inviter_id = (SELECT tokens.user_id FROM tokens WHERE tokens.token = ?))`,
                [friendID, token, friendID, token],
                (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    res.send({ success: results.affectedRows == 1 });
                }
            );2
        });

        api.post("/searchPeople", (req, res) => {

            var q = db.connection.escape(req.body.q);
            var query = `
                SELECT * FROM user_info
                WHERE username LIKE CONCAT("%", ` + q + `, "%")
            `;

            if ("colorClass" in req.body && req.body["colorClass"] != "all")
                query += `
                    AND color_class_id = ` + db.connection.escape(req.body["colorClass"]);

            if ("sortBy" in req.body) {
                var col = {
                    "activity": "last_activity",
                    "friends": "friends",
                    "rep": "rep",
                    "messages": "messages",
                    "uploads": "uploads",
                    "joined": "joined_on"
                }[req.body.sortBy];
                if (col != undefined)
                    query += `
                        ORDER BY ` + col + (req.body.desc == true ? ` DESC` : ``);
            }
            var pageLimit = 8;
            var page = parseInt(req.body.page) || 0;
            query += `
                LIMIT ` + pageLimit + ` OFFSET ` + (page * pageLimit);

            db.connection.query(query, [], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return res.send([]);
                }
                if (q != "''") console.log("Gezocht naar mensen like " + q);
                var users = [];
                for (var i in rows) users.push(utils.userInfo(rows[i]));
                res.send(users);
            });
        });

        api.post("/updateStatus", (req, res) => {

            var status = String(req.body.status);
            status = status.replace(/\n\s*\n\s*\n/g, '\n\n'); // remove unnecessary newlines
            if (status.length > 255) return utils.sendError(res, "Status is te lang >:(");
            var token = parseInt(req.body.token) || 0;

            db.connection.query(`
                    UPDATE users SET bio = ? WHERE user_id = (SELECT user_id FROM tokens WHERE token = ?)
                    `, [status, token], (err, results, fields) => {

                    if (err) {
                        console.log(err);
                        return utils.sendError(res, "huuuuu er ging iets mis");
                    }
                    if (results.affectedRows == 1)
                        res.send({ success: true });
                    else utils.sendError(res, "Probeer es opnieuw in te loggen");
                });
        });

    }

}