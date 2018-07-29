SELECT
    votes.entity_id AS voted_entity_id,
    votes.*,			                                # how many times was the entity (dis)liked and when
    posts.*,											# the (dis)liked post
    entity_comments.*									# the (dis)liked comment
FROM (
    SELECT
        
        GROUP_CONCAT(voter.user_id ORDER BY entity_votes.time DESC) AS voter_ids,
        entities.entity_id,
        up,
        COUNT(*) AS votes,
        MAX(entity_votes.time) AS last_vote_time
        
    FROM
        entity_votes
    
    JOIN entities ON (
        entities.entity_id = entity_votes.entity_id
    )
    
    JOIN tokens ON (
        entities.user_id = tokens.user_id
        AND
        tokens.token = ?
        AND
        entity_votes.user_id != tokens.user_id      # exclude own votes from notifications
    )
    
    JOIN users AS voter ON (
		entity_votes.user_id = voter.user_id
    )

    WHERE entity_votes.time >= ? AND entity_votes.time <= ?
    
    GROUP BY entities.entity_id, entity_votes.up
) AS votes

LEFT JOIN posts ON posts.post_id = votes.entity_id
LEFT JOIN entity_comments ON entity_comments.entity_id = votes.entity_id
