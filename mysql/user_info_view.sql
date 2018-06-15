USE tjillepret;
DROP VIEW IF EXISTS user_info;
CREATE VIEW user_info AS
SELECT 
	*, 
    (
		SELECT COUNT(*) 
		FROM friendships 
        WHERE inviter_id = user_id OR accepter_id = user_id
    ) AS friends,
    
    
    (
		SELECT COUNT(*) 
		FROM posts 
        WHERE uploaded_by = user_id
	) AS uploads,
    
    
    (
		SELECT COUNT(*) 
		FROM chat_members 
        JOIN chats ON (chats.chat_id = chat_members.chat_id AND chats.is_group = 1) 
        WHERE chat_members.user_id = users.user_id
	) AS groups,
    
    
    (
		SELECT COUNT(*)
		FROM messages 
        WHERE sent_by = user_id
	) AS messages,
    
    
    (
		(
			SELECT COUNT(*)
			FROM post_votes
			JOIN posts ON (posts.post_id = post_votes.post_id)
			WHERE post_votes.up = 1 AND posts.uploaded_by = users.user_id
		)
		-
		(
			SELECT COUNT(*)
			FROM post_votes
			JOIN posts ON (posts.post_id = post_votes.post_id)
			WHERE post_votes.up = 0 AND posts.uploaded_by = users.user_id
		)
	) 
	+ 
	(
		(
			SELECT COUNT(*)
			FROM comment_votes
			JOIN comments ON (comments.comment_id = comment_votes.comment_id)
			WHERE comment_votes.up = 1 AND comments.user_id = users.user_id
		)
		-
		(
			SELECT COUNT(*)
			FROM comment_votes
			JOIN comments ON (comments.comment_id = comment_votes.comment_id)
			WHERE comment_votes.up = 0 AND comments.user_id = users.user_id
		)
	) AS rep,
    
    (
		SELECT SUM(views) FROM posts WHERE posts.uploaded_by = user_id
    ) AS views,
    
    (
		SELECT COUNT(*) FROM comments WHERE comments.user_id = users.user_id
    ) AS comments
    
FROM users;