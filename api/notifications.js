
const db = require("./database.js");
const utils = require("./utils.js");
const posts = require("./posts.js");
const fs = require("fs");
const users = require("./users.js");

const commentsQuery = fs.readFileSync(__dirname + "/queries/notifications/comments.sql").toString();
const friendAcceptancesQuery = fs.readFileSync(__dirname + "/queries/notifications/friend-acceptances.sql").toString();
const votesQuery = fs.readFileSync(__dirname + "/queries/notifications/votes.sql").toString();

module.exports = {

    getCheckedNotificationsTime: (token) => new Promise(resolve => {
        db.connection.query(`
            SELECT checked_notifications_time
            FROM users, tokens
            WHERE users.user_id = tokens.user_id
            AND tokens.token = ?
        `, [token], (err, rows, fields) => {
            if (err) {
                console.log(err);
                resolve(0);
            }
            resolve(rows.length > 0 ? parseInt(rows[0].checked_notifications_time) : 0);
        });
    }),

    apiFunctions: (api) => {

        api.post("/notifications", async (req, res) => {

            let token = parseInt(req.body.token) || 0;
            let usersPerNotification = parseInt(req.body.usersPerNotification) || 5;
            let fromTime = parseInt(req.body.fromTime) || 0;
            let toTime = parseInt(req.body.toTime) || Date.now() / 1000 | 0;
            checkedNotificationsTime = await module.exports.getCheckedNotificationsTime(token);

            let funcs = [
                getCommentNotifications,
                getFriendAcceptNotifications,
                getVoteNotifications
            ]

            let notifications = await Promise.all(
                funcs.map(fun => fun(token, fromTime, toTime))
            ).then(arrayOfArrays => [].concat.apply([], arrayOfArrays));

            var userIds = [];
            for (var n of notifications) {
                if (!("userIds" in n)) continue;

                userIds = userIds.concat(n.userIds.slice(0, usersPerNotification));
            }
            userIds = userIds.filter((val, i) => userIds.indexOf(val) === i);

            res.send({
                checkedNotificationsTime,
                notifications,
                users: userIds.length == 0 ? [] : await users.getUsersByids(userIds)
            });
        });

    }
}

const getCommentNotifications = (token, fromTime, toTime) => new Promise(resolve => {

    db.connection.query(commentsQuery, [token, fromTime, toTime], (err, rows, fields) => {

        if (err) {
            console.log(err);
            return resolve([]);
        }

        var notifications = [];

        for (var row of rows) notifications.push({

            type: "COMMENTS",
            time: row.latest_comment_time,
            userIds: row.commenter_ids.split(",").map(id => parseInt(id)),

            numberOfCommenters: row.number_of_commenters,

            commentsOnMyComment: row.text ?
                {
                    id: row.entity_id,
                    time: row.time,
                    text: row.text,
                    giphy: row.giphy,
                    deleted: row.deleted == 1
                }
                : undefined,

            commentsOnMyPost: row.post_id ? posts.post(row) : undefined,

            commentsOnMyProfile: row.comments_on_my_profile == 1

        });
        resolve(notifications);
    });
});


const getFriendAcceptNotifications = (token, fromTime, toTime) => new Promise(resolve => {

    db.connection.query(friendAcceptancesQuery, [token, fromTime, toTime], (err, rows, fields) => {

        if (err) {
            console.log(err);
            return resolve([]);
        }

        var notifications = [];

        for (var row of rows) notifications.push({

            type: "FRIEND_ACCEPTANCE",
            time: row.since,
            userIds: [row.accepter_id],

            accepterId: row.accepter_id

        });

        resolve(notifications);
    });

});

const getVoteNotifications = (token, fromTime, toTime) => new Promise(resolve => {

    db.connection.query(votesQuery, [token, fromTime, toTime], (err, rows, fields) => {

        if (err) {
            console.log(err);
            return resolve([]);
        }


        var notifications = [];

        for (var row of rows) notifications.push({

            type: "VOTES",
            time: row.last_vote_time,
            userIds: row.voter_ids.split(",").map(id => parseInt(id)),

            numberOfVotes: row.votes,
            up: row.up == 1,

            comment: row.comment_on_entity_id ?
                {
                    id: row.entity_id,
                    time: row.time,
                    text: row.text,
                    giphy: row.giphy,
                    deleted: row.deleted == 1
                }
                : undefined,

            post: row.post_id ? posts.post(row) : undefined

        });

        resolve(notifications);

    });

});