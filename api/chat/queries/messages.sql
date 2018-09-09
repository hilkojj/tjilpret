SELECT mes.*, att.* FROM tokens

JOIN chat_members member ON member.user_id = tokens.user_id AND member.chat_id = ?

JOIN messages mes ON (

	mes.chat_id = member.chat_id
    AND
	mes.sent_on >= member.joined_chat_on
    AND (
		member.left_chat_on IS NULL
        OR
        mes.sent_on <= member.left_chat_on
    )
    AND
    mes.sent_on <= ?

)

# attachment (optional)
LEFT JOIN message_attachment att ON mes.attachment_id = att.attachment_id

WHERE token = ?
ORDER BY sent_on DESC, id DESC
LIMIT ?
