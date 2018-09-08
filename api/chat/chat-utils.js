
const utils = require("../utils");

const conversation = row => {
    return {
        chatId: row.chat_id,
        unread: row.unread,
        joinedChatOn: row.joined_chat_on,
        leftChatOn: row.left_chat_on,
        isChatAdmin: row.is_chat_admin,
        muted: row.muted,
        readTime: row.read_time,
        startedBy: row.started_by,
        startedOn: row.started_on,
        isGroup: row.is_group,
        groupTitle: row.group_title,
        groupPic: row.left_chat_on != null ? null : row.group_pic, // user is not allowed to see group_pic when user has left the group
        groupDescription: row.group_description,
        latestMessage: row.id == null ? null : message(row),
        latestSenderUsername: row.latest_sender_username,
        otherUser: row.user_id == null ? null : utils.userInfo(row)
    }
}

const message = row => {
    return {
        chatId: row.chat_id,
        id: row.id,
        sentBy: row.sent_by,
        sentOn: row.sent_on,
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

module.exports = {
    conversation,
    message
}
