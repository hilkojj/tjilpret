SELECT mes.*, att.* FROM tokens

JOIN chat_members member ON member.user_id = tokens.user_id AND member.chat_id = ?

JOIN messages mes ON (

	mes.chat_id = member.chat_id
    AND
	mes.sent_timestamp >= member.joined_timestamp
    AND (
		member.left_timestamp IS NULL
        OR
        mes.sent_timestamp <= member.left_timestamp
    )
    AND
    mes.sent_timestamp <= ?

)

# attachment (optional)
LEFT JOIN message_attachment att ON mes.attachment_id = att.attachment_id

WHERE token = ?
ORDER BY sent_timestamp DESC, id DESC
LIMIT ?
