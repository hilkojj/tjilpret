SELECT

	*

FROM (

	SELECT
		
        GROUP_CONCAT(DISTINCT commenter.user_id ORDER BY comment.time DESC) AS commenter_ids,
		parent_entity.entity_id AS parent_id,
		COUNT(DISTINCT comment_entity.user_id) AS number_of_commenters,
		MAX(comment.time) AS latest_comment_time,
        parent_entity.entity_id = tokens.user_id AS comments_on_my_profile
        
	FROM
		entity_comments AS comment

	JOIN tokens ON tokens.token = ?

	JOIN entities
	AS comment_entity ON comment.entity_id = comment_entity.entity_id
    
    JOIN users
    AS commenter ON comment_entity.user_id = commenter.user_id

	JOIN entities 
	AS comment_on ON comment.comment_on_entity_id = comment_on.entity_id

	LEFT JOIN entity_comments 
	AS thread_starter_comment ON (
		comment_on.entity_id = thread_starter_comment.entity_id
	)
	LEFT JOIN entities
	AS thread_starter_entity ON (
		thread_starter_comment.entity_id = thread_starter_entity.entity_id
	)

	JOIN entities 
	AS parent_entity ON (

		(
			parent_entity.entity_id = tokens.user_id 	# parent_entity IS user
			OR
			parent_entity.user_id = tokens.user_id		# parent_entity is of user
		)
		AND
		(		
			(
				thread_starter_comment.entity_id IS NULL
				AND
				comment.comment_on_entity_id = parent_entity.entity_id
			)
			OR
			thread_starter_comment.entity_id = parent_entity.entity_id
		)
	)

	WHERE comment_entity.user_id != tokens.user_id # exclude own comments from notifications..

	GROUP BY parent_id, comments_on_my_profile
    
) AS comments_freq

LEFT JOIN posts ON posts.post_id = comments_freq.parent_id

LEFT JOIN entity_comments ON entity_comments.entity_id = comments_freq.parent_id

WHERE latest_comment_time >= ?
AND latest_comment_time <= ?
