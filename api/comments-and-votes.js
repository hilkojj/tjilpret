
const db = require("./database.js");
const utils = require("./utils.js");

module.exports = {

    isCommentOnComment: function (entityId, callback) {

        var query = `SELECT * FROM entity_comments WHERE entity_id = ?`;

        db.connection.query(query, [entityId], (err, rows, fields) => {

            if (rows.length == 0) return callback(false);

            db.connection.query(query, [rows[0].comment_on_entity_id], (err, rows, fields) => {
                callback(rows.length != 0);
            });

        });
    },

    getVotes: function (entityIds, token, callback) {

        db.connection.query(`
            SELECT
                entities.entity_id,
                (SELECT COUNT(*) FROM entity_votes WHERE entity_votes.entity_id = entities.entity_id AND up)
                AS up,
                (SELECT COUNT(*) FROM entity_votes WHERE entity_votes.entity_id = entities.entity_id AND NOT up)
                AS down,
                COALESCE(
                    (SELECT IF(up, 1, -1) FROM entity_votes WHERE entity_votes.entity_id = entities.entity_id AND entity_votes.user_id = tokens.user_id),
                    0
                )
                AS my_vote
            FROM
                entities
            LEFT JOIN tokens ON tokens.token = ?
            
            WHERE
                entities.entity_id IN (?)`, [token, entityIds],
            (err, rows, fields) => {

                if (err) {
                    console.log(err);
                    return callback({});
                }

                var votes = {};

                for (var i in rows) {

                    var row = rows[i];
                    votes[row.entity_id] = {
                        upVotes: row.up,
                        downVotes: row.down,
                        myVote: row.my_vote
                    }
                }

                callback(votes);
            }
        );
    },

    apiFunctions: function (api) {

        api.post("/postComment", (req, res) => {

            var comment = String(req.body.comment || "");
            comment = utils.removeExtraNewlines(comment);
            if (comment.length > 512) return utils.sendError(res, "Tekst is te lang lul");
            var token = parseInt(req.body.token);
            var entityId = parseInt(req.body.entityId);

            if (String(req.body.giphy || "").length == 0 && comment.length == "")
                return utils.sendError(res, "Je moet wel iets versturen >:|");

            if (!token || !entityId)
                return utils.sendError(res, !token ? "Geen token gegeven" : "Geen entityId gegeven");

            this.isCommentOnComment(entityId, cantPost => {

                if (cantPost)
                    return utils.sendError(res, "Kan geen reactie op een reactie op een reactie plaatsen. Wat denk je wel niet.");

                utils.createEntity(null, token, id => {

                    db.connection.query(`INSERT INTO entity_comments SET ?`,
                        {
                            entity_id: id,
                            comment_on_entity_id: entityId,
                            time: Date.now() / 1000 | 0,
                            text: comment,
                            giphy: req.body.giphy

                        }, (err, results, fields) => {

                            if (err) {
                                console.log(err);
                                return utils.sendError(res, "huuuuu er ging iets mis");
                            }
                            res.send({ success: true });
                        }
                    );
                });
            });
        });

        api.post("/comments", (req, res) => {
            var entityId = parseInt(req.body.entityId) || 0;
            db.connection.query(`
                SELECT comments.*, user_info.* FROM (
                    SELECT * FROM entity_comments WHERE comment_on_entity_id = ?
                    UNION
                    SELECT * FROM entity_comments AS sub WHERE comment_on_entity_id IN (
                        SELECT entity_id FROM entity_comments AS com WHERE com.comment_on_entity_id = ?
                    )
                ) AS comments
                JOIN entities ON (entities.entity_id = comments.entity_id)
                JOIN user_info ON (user_info.user_id = entities.user_id)
                ORDER BY comment_on_entity_id ASC
                `, [entityId, entityId], (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }

                    var comments = {};
                    var commentsAndSubComments = {};
                    for (var i in rows) {
                        var row = rows[i];

                        var comment = {
                            id: row.entity_id,
                            user: utils.userInfo(row),
                            time: row.time,
                            text: row.text,
                            giphy: row.giphy,
                            deleted: row.deleted == 1
                        }

                        if (row.comment_on_entity_id != entityId) {

                            var parentComment = comments[row.comment_on_entity_id];

                            if (!("subComments" in parentComment)) parentComment.subComments = [];

                            parentComment.subComments.push(comment);

                        } else comments[comment.id] = comment;

                        commentsAndSubComments[comment.id] = comment;
                    }
                    this.getVotes(Object.keys(commentsAndSubComments), parseInt(req.body.token) || 0, votes => {
                        for (var i in votes) {
                            commentsAndSubComments[i].votes = votes[i];
                        }
                        res.send(Object.values(comments));
                    });
                }
            );
        });

        api.post("/deleteComment", (req, res) => {

            var commentId = parseInt(req.body.commentId);
            var token = parseInt(req.body.token);

            if (!commentId) return utils.sendError(res, "No commentId given");
            if (!token) return utils.sendError(res, "No token given");

            db.connection.query(`
                UPDATE 
                    entity_comments AS comment

                JOIN entities AS comment_entity ON (
                    comment_entity.entity_id = comment.entity_id
                    AND
                    comment_entity.entity_id = ?
                )
                JOIN users AS commenter ON comment_entity.user_id = commenter.user_id

                JOIN entities AS commented_on ON commented_on.entity_id = comment.comment_on_entity_id
                LEFT JOIN users AS profile ON commented_on.entity_id = profile.user_id

                JOIN tokens AS token ON token.token = ?
                JOIN users AS user ON user.user_id = token.user_id

                SET
                    text = CONCAT("*verwyderd door ", user.username, "*"),
                    giphy = NULL,
                    deleted = true

                WHERE user.is_admin

                OR commenter.user_id = user.user_id

                OR profile.user_id = user.user_id
            `, [commentId, token], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    res.send({ success: results.affectedRows == 1 });
                });
        });

        api.post("/vote", (req, res) => {
            var token = parseInt(req.body.token) || 0;
            var entityId = parseInt(req.body.entityId) || -1;
            var vote = req.body.vote == 1 ? 1 : (req.body.vote == -1 ? -1 : 0);

            var values = [entityId, token];
            if (vote != 0) values = [...values, token, entityId, vote == 1, Date.now() / 1000 | 0];

            console.log(values);

            db.connection.query(`
                DELETE FROM entity_votes
                WHERE entity_id = ? AND user_id = (SELECT user_id FROM tokens WHERE token = ?);
            ` + (vote != 0 ? `

                INSERT INTO entity_votes
                (user_id, entity_id, up, time)
                VALUES
                ((SELECT user_id FROM tokens WHERE token = ?), ?, ?, ?)

            `: ""), values, (err, rows, fields) => {

                    if (err) {
                        console.log(err);
                        return utils.sendError(res, "Er is iets vreselijk mis gegaan");
                    }

                    this.getVotes([entityId], token, votes => {
                        res.send(votes[entityId]);
                    });
                }
            );
        });

    }

}