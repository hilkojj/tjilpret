const utils = require("../utils");
const db = require("../database");
const webpush = require("web-push");
const fs = require("fs");

/*
vapid-details.json example:
{
    "mailto": "example@example.com",
    "publicKey": "abc123",
    "privateKey": "xyx789"
}
*/

const vapidDetails = JSON.parse(fs.readFileSync(__dirname + "/vapid-details.json").toString());
webpush.setVapidDetails(
    vapidDetails.mailto,
    vapidDetails.publicKey,
    vapidDetails.privateKey
);

const triggerPushMsg = (subscription, data) => {
    return webpush.sendNotification(subscription, JSON.stringify(data))
        .catch((err) => {
            if (err.statusCode == 410 || err.statusCode == 404)
                return deleteSub(subscription);

            else console.log("webpush sendNotification error: ", err);
        });
}

const deleteSub = sub => {
    console.log("delete sub", sub);
    db.connection.query(`DELETE FROM push_subscriptions WHERE endpoint = ?`, [sub.endpoint], (err, results) => {
        if (err) console.log(err);
    });
}

const apiFunctions = api => {

    api.post("/savePushSubscription", async (req, res) => {

        var token = parseInt(req.body.token);
        if (!token) return utils.sendError(res, "No token given");

        var sub = req.body.subscription;
        if (!sub) return utils.sendError(res, "Please include the subscription in the body");
        if (!sub.keys) return utils.sendError(res, "No keys found in subscription");

        var endpoint = String(sub.endpoint);
        var auth = String(sub.keys.auth);
        var p256dh = String(sub.keys.p256dh);

        var userId = await utils.getUserIdByToken(token);

        if (!userId) return utils.sendError(res, "Invalid token");

        var timestamp = Date.now() / 1000 | 0;

        db.connection.query(
            `INSERT INTO push_subscriptions 
            (endpoint, token, user_id, auth_key, p256dh_key, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
            
            ON DUPLICATE KEY UPDATE token = ?, user_id = ?, updated_timestamp = ?`,
            [endpoint, token, userId, auth, p256dh, timestamp, token, userId, timestamp],
            (err, results, fields) => {

                if (err || results.affectedRows == 0) {
                    if (err) console.log(err);
                    return utils.sendError(res, "sorri er is iets mis gegaan");
                }

                res.send({ success: true });
            }
        );
    });

}

module.exports = {
    apiFunctions,
    triggerPushMsg
}