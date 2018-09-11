
const utils = require("../utils");

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
        type: row.type,
        timestamp: row.timestamp,
        by: row.by, 
        who: row.who,
        byUsername: row.by_username,
        whoUsername: row.who_username
    }
}

module.exports = {
    conversation,
    message,
    attachment,
    event
}
