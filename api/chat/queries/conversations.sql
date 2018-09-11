SELECT
	#get number of unread messages:
    (
		SELECT COUNT(*) FROM messages mes1 
        WHERE mes1.chat_id = member.chat_id
        AND mes1.sent_timestamp >= member.joined_timestamp
        AND (
			member.read_timestamp IS NULL
            OR
			mes1.sent_timestamp >= member.read_timestamp
		)
        AND (
			member.left_timestamp IS NULL
            OR
            mes1.sent_timestamp <= member.left_timestamp
		)
    ) AS unread,
	member.chat_id, member.joined_timestamp, member.left_timestamp, member.is_chat_admin, member.muted, member.read_timestamp,
    chat.*, 
    mes.id, mes.sent_by, mes.sent_timestamp, mes.text, mes.attachment_id, mes.old_time,
    
    sender.username AS sender_username,
    sender.profile_pic AS sender_profile_pic,
    sender.r AS sender_r, sender.g AS sender_g, sender.b AS sender_b,
    
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
        AND mes1.sent_timestamp >= member.joined_timestamp
        AND (
			member.left_timestamp IS NULL
            OR
            mes1.sent_timestamp <= member.left_timestamp
		)
        ORDER BY mes1.sent_timestamp DESC, mes1.id DESC
        LIMIT 1
    )
)

#get attachment info:
LEFT JOIN message_attachment att ON att.attachment_id = mes.attachment_id

#get sender of latest message:
LEFT JOIN users sender ON sender.user_id = mes.sent_by

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
