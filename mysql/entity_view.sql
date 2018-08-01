CREATE VIEW entity_view AS
    SELECT 
        entities.entity_id AS entity_id,
        entities.user_id AS user_id,
        (SELECT 
                COALESCE((SUM(entity_votes.up) - (COUNT(0) - SUM(entity_votes.up))), 0)
            FROM
                entity_votes
            WHERE
                (entity_votes.entity_id = entities.entity_id)) AS score,
        (
			SELECT COUNT(*) FROM entity_comments
			LEFT JOIN entity_comments AS sub ON (
				sub.comment_on_entity_id = entity_comments.entity_id
				OR
				sub.entity_id = entity_comments.entity_id
			)
			WHERE entity_comments.comment_on_entity_id = entities.entity_id
        ) AS comments
    FROM
        entities