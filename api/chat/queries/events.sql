SELECT event.* FROM tokens

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

WHERE token = ?
ORDER BY event.timestamp DESC
