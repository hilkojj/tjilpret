
const utils = require("../utils");
const db = require("../database");

const conversation = row => {
    return {
        chatId: row.chat_id,
        unread: row.unread,
        joinedTimestamp: row.joined_timestamp,
        leftTimestamp: row.left_timestamp,
        isChatAdmin: row.is_chat_admin,
        muted: row.muted,
        readTimestamp: row.read_timestamp,
        startedBy: row.started_by,
        startedTimestamp: row.started_timestamp,
        isGroup: row.is_group,
        groupTitle: row.group_title,
        groupPic: row.left_timestamp != null ? null : row.group_pic, // user is not allowed to see group_pic when user has left the group
        groupDescription: row.group_description,
        latestMessage: row.id == null ? null : message(row),
        otherUser: row.user_id == null ? null : utils.userInfo(row)
    }
}

const message = row => {
    return {
        chatId: row.chat_id,
        groupTitle: row.group_title,
        id: row.id,
        sentBy: row.sent_by,
        senderUsername: row.sender_username,
        senderProfilePic: row.sender_profile_pic,
        senderFavColor: {
            r: row.sender_r, g: row.sender_g, b: row.sender_b
        },
        sentTimestamp: row.sent_timestamp,
        text: row.text,
        attachment: attachment(row),
        oldTimeString: row.old_time  // only for old messages
    }
}

const attachment = row => {
    if (row.attachment_id == null) return null;
    return {
        id: row.attachment_id,
        type: row.type,
        path: row.path,
        thumbnail: row.thumbnail
    }
}

const event = row => {
    return {
        id: row.id,
        chatId: row.chat_id,
        groupTitle: row.group_title,
        type: row.type,
        timestamp: row.timestamp,
        by: row.by,
        who: row.who,
        byUsername: row.by_username,
        whoUsername: row.who_username
    }
}

const getCoMemberIds = userId => new Promise(resolve => {

    db.connection.query(`
        SELECT DISTINCT comember.user_id FROM chat_members member

        # comembers
        JOIN chat_members comember ON comember.chat_id = member.chat_id AND comember.user_id != ?
        AND comember.left_timestamp IS NULL
        
        # comember user
        JOIN users co_user ON co_user.user_id = comember.user_id
        
        WHERE member.user_id = ?
    `, [userId, userId], (err, rows) => {
        if (err) {
            console.log(err);
            return resolve([]);
        }
        resolve(rows.map(row => row.user_id));
    })

})

const getMemberIds = chatId => new Promise(resolve => {

    db.connection.query(`SELECT user_id FROM chat_members WHERE chat_id = ? AND left_timestamp IS NULL`, [chatId], (err, rows, fields) => {

        if (err) {
            console.log(err);
            return resolve([]);
        }

        resolve(rows.map(row => row.user_id));
    });

});

const getMemberSubscriptions = chatId => new Promise(resolve => {

    db.connection.query(`
        SELECT 
            chat_members.user_id, sub.endpoint, sub.auth_key, sub.p256dh_key, muted 
        FROM chat_members
        LEFT JOIN push_subscriptions sub ON sub.user_id = chat_members.user_id
        WHERE chat_id = ? AND left_timestamp IS NULL
    `, [chatId], (err, rows) => {
        if (err) {
            console.log(err);
            return resolve({});
        }
        var subs = {};
        for (var row of rows) {
            var sub = row.endpoint ? {
                endpoint: row.endpoint,
                keys: {
                    auth: row.auth_key,
                    p256dh: row.p256dh_key
                },
                muted: row.muted
            } : null;
            var userSubs = subs[row.user_id];
            if (userSubs) {
                if (sub) userSubs.push(sub);
            } else subs[row.user_id] = sub ? [sub] : [];
        }
        resolve(subs);
    });

});

const isMember = (userId, chatId) => new Promise(resolve => {
    db.connection.query(
        `SELECT user_id FROM chat_members WHERE chat_id = ? AND user_id = ? AND left_timestamp IS NULL`,
        [chatId, userId], (err, rows, fields) => resolve(rows.length > 0)
    )
})

const getMessage = messageId => new Promise(resolve => {

    db.connection.query(`
        SELECT
            mes.*, att.*, sender.username AS sender_username, sender.profile_pic AS sender_profile_pic, 
            r AS sender_r, g AS sender_g, b AS sender_b, group_title
        FROM messages mes

        LEFT JOIN message_attachment att ON att.attachment_id = mes.attachment_id

        JOIN users sender ON mes.sent_by = sender.user_id

        JOIN chats chat ON chat.chat_id = mes.chat_id

        WHERE mes.id = ?`, [messageId], (err, rows, fields) => {

            if (err) {
                console.log(err);
                return resolve(null);
            }
            var row = rows[0];
            resolve(row ? message(row) : null);
        }
    );
});

module.exports = {
    conversation,
    message,
    attachment,
    event,
    getCoMemberIds,
    getMemberIds,
    getMemberSubscriptions,
    isMember,
    getMessage
}
