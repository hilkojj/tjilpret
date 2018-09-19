SELECT event.*, user_by.username AS by_username, user_who.username AS who_username, group_title FROM tokens

JOIN chat_members member ON member.user_id = tokens.user_id AND member.chat_id = ?

JOIN chat_events event ON (

	event.chat_id = member.chat_id
    AND
	event.timestamp >= member.joined_timestamp
    AND
    event.timestamp >= ?
    AND (
		member.left_timestamp IS NULL
        OR
        event.timestamp <= member.left_timestamp
    )
    AND
    event.timestamp <= ?

)

LEFT JOIN users user_by ON user_by.user_id = event.by

LEFT JOIN users user_who ON user_who.user_id = event.who

JOIN chats chat ON chat.chat_id = event.chat_id

WHERE token = ?
ORDER BY event.timestamp DESC
LIMIT ?