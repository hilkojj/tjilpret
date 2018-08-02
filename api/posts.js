
const utils = require("./utils.js");
const db = require("./database.js");

module.exports = {

    post: row => {
        return {
            id: row.post_id,
            title: row.title,
            uploadedBy: row.user_id,
            description: row.description,
            views: row.views,
            duration: row.duration,
            time: row.uploaded_on,
            path: row.path,
            thumbnailPath: row.thumbnail_path,
            type: row.type,
            score: row.score,
            comments: row.comments
        }
    },

    apiFunctions: api => {

        api.post("/postsOfUser/:userId", (req, res) => {

            var userId = parseInt(req.params.userId);

            var pageLimit = 16;
            var page = parseInt(req.body.page) || 0;
            db.connection.query(`
                SELECT posts.*, entity_view.* FROM posts

                JOIN entities ON posts.post_id = entities.entity_id
                
                JOIN users ON users.user_id = entities.user_id

                JOIN entity_view ON entities.entity_id = entity_view.entity_id
                
                WHERE users.user_id = ?
                AND title LIKE CONCAT("%", ?, "%")
                
                ORDER BY ${{ "time": "uploaded_on", "score": "score" }[req.body.orderBy] || "uploaded_on"} DESC
                
                LIMIT ? OFFSET ?
                `, [userId, req.body.q, pageLimit, page * pageLimit],
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        return res.send([]);
                    }
                    var posts = [];
                    for (var row of rows) posts.push(module.exports.post(row));
                    res.send(posts);
                }
            );

        });

        api.post("/post/:id", (req, res) => {

            var id = parseInt(req.params.id);
            db.connection.query(`
                SELECT posts.*, entity_view.* FROM posts
                JOIN entity_view ON posts.post_id = entity_view.entity_id
                WHERE posts.post_id = ?
            `, [id], (err, rows, fields) => {

                    if (err) {
                        console.log(err);
                        return utils.sendError(res, "POTVERDIKKEME foutje");
                    }

                    var row = rows[0];

                    if (!row) {
                        res.send({ found: false });
                    }
                    res.send({ found: true, post: module.exports.post(row) });
                }
            );
        });

    }

}