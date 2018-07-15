
const db = require("./database.js");
const utils = require("./utils.js");
const convert = require('color-convert');

module.exports = {

    apiFunctions: function (api) {

        api.get("/updateColors", (req, res) => {

            db.connection.query("SELECT * FROM users", [], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                } else for (var i in rows) {
                    var row = rows[i];
                    this.updateFavColor(row.user_id, row.r, row.g, row.b, function (success) { });
                }
            });

        });

        api.post("/colorInfo", (req, res) => {
            var colorClassID = parseInt(req.body.colorClassID);
            db.connection.query("SELECT *, (SELECT COUNT(*) FROM users WHERE color_class_id = ?) AS people FROM color_classes WHERE id = ?",
                [colorClassID, colorClassID], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return utils.sendError(res, "Database error :(");
                    }
                    res.send(results[0]);
                });
        });

        api.post("/colorInfoByUserID", (req, res) => {
            db.connection.query(`
                SELECT 
                    color_classes.*, 
                    (SELECT COUNT(*) FROM users WHERE color_class_id = color_classes.id) AS people
                FROM color_classes, users 
                WHERE color_classes.id = users.color_class_id 
                AND users.user_id = ?`,
                [parseInt(req.body.id) || 0], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return utils.sendError(res, "Database error :(");
                    }
                    res.send(results[0]);
                });
        });

        api.post("/allColors", (req, res) => {
            db.connection.query("SELECT *, (SELECT COUNT(*) FROM users WHERE color_class_id = color_classes.id) AS people FROM color_classes",
                [], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        return utils.sendError(res, "Database error :(");
                    }
                    res.send(results);
                });
        });

        api.post("/changeFavColor", (req, res) => {

            var color = { r: 0, g: 0, b: 0 };
            for (var i in color) {
                if (!(i in req.body)) return res.send({ success: false });
                var val = parseInt(req.body[i]) || 0;
                val = Math.max(0, Math.min(255, val)) | 0;
                color[i] = val;
            }
            db.connection.query(`
                    SELECT users.user_id, username FROM tokens, users WHERE users.user_id = tokens.user_id AND token = ?
                    `, [req.body.token], (err, rows, fields) => {

                    if (err) {
                        console.log(err);
                        return res.send({ success: false });
                    }
                    if (0 in rows) this.updateFavColor(rows[0].user_id, color.r, color.g, color.b, function (success) {
                        console.log(rows[0].username + " heeft zijn lieflingskleur gewijzigd " + Date());
                        res.send({ success: success });
                    });
                    else res.send({ success: false });
                });
        });

    },

    updateFavColor: function (userID, r, g, b, callback) {

        var hsl = convert.rgb.hsl(r, g, b);
        if (hsl.l > 70)
            return callback(false);

        this.getColorClasses((classes) => {
            var colorClass = null;
            for (var i in classes) {
                var c = classes[i];
                if (hsl[2] < c.max_lightness * 100) {
                    colorClass = c;
                    break;
                } else if (hsl[1] < c.max_saturation * 100) {
                    colorClass = c;
                    break;
                } else if (hsl[0] < c.max_hue) {
                    colorClass = c;
                    break;
                }
            }
            if (colorClass == null)
                colorClass = classes[2]; // red

            db.connection.query("UPDATE users SET r = ?, g = ?, b = ?, color_class_id = ? WHERE user_id = ?",
                [r, g, b, colorClass.id, userID], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        callback(false);
                    }
                    callback(results.affectedRows == 1);
                });
        });
    },

    getColorClasses: function (callback) {
        db.connection.query("SELECT * FROM color_classes ORDER BY max_hue", [], (err, rows, fields) => {
            if (err) {
                console.log(err);
                return callback([]);
            }
            callback(rows);
        });
    }

}