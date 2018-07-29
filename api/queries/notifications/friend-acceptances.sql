SELECT
    friendships.*
FROM
    tokens
    
JOIN users ON tokens.user_id = users.user_id

JOIN friendships ON (
    friendships.inviter_id = users.user_id
)

WHERE tokens.token = ?
AND since >= ? AND since <= ?
