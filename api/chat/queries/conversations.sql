SELECT
	#get number of unread messages:
    (
		SELECT COUNT(*) FROM messages mes1 
        WHERE mes1.chat_id = member.chat_id
        AND mes1.sent_on >= member.joined_chat_on
        AND (
			member.read_time IS NULL
            OR
			mes1.sent_on >= member.read_time
		)
        AND (
			member.left_chat_on IS NULL
            OR
            mes1.sent_on <= member.left_chat_on
		)
    ) AS unread,
	member.chat_id, member.joined_chat_on, member.left_chat_on, member.is_chat_admin, member.muted, member.read_time,
    chat.*, 
    mes.*, 
    
    #get username of sender of latest message:
    (
		SELECT username FROM users latest_sender WHERE latest_sender.user_id = mes.sent_by
    ) AS latest_sender_username,
    
    att.*, 
    other_user.*
    
FROM 
	chat_members member
    
JOIN tokens ON (
	token = ? AND member.user_id = tokens.user_id
)

# get latest message:
LEFT JOIN messages mes ON (
	mes.id = (
		SELECT id FROM messages mes1 
        WHERE mes1.chat_id = member.chat_id
        AND mes1.sent_on >= member.joined_chat_on
        AND (
			member.left_chat_on IS NULL
            OR
            mes1.sent_on <= member.left_chat_on
		)
        ORDER BY mes1.sent_on DESC, mes1.id DESC
        LIMIT 1
    )
)

#get attachment info:
LEFT JOIN message_attachment att ON att.attachment_id = mes.attachment_id

#chat info:
JOIN chats chat ON chat.chat_id = member.chat_id


#if this is a private chat (not a group), then get info of the other user:

#first get the 'membership' of the other user:
LEFT JOIN chat_members other_member ON (
	!chat.is_group
    AND
	other_member.chat_id = member.chat_id
    AND
    other_member.user_id != member.user_id
)
#then get the user_info of the other user:
LEFT JOIN user_info other_user ON other_member.user_id = other_user.user_id
;
