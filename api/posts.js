
const utils = require("./utils.js");

module.exports = {

    post: row => {
        return {
            id: row.post_id,
            title: row.title,
            description: row.description,
            views: row.views,
            time: row.uploaded_on,
            path: row.path,
            type: row.type,
            score: row.score
        }
    },

    apiFunctions: api => {

    }

}