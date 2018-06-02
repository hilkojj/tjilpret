
const db = require("./database.js");
const utils = require("./utils.js");
const convert = require('color-convert');

module.exports = {

    apiFunctions: function (api) {

        // api.get("/updateColors", (req, res) => {

        //     db.connection.query("SELECT * FROM users", [], (err, rows, fields) => {
        //         if (err) {
        //             console.log(err);
        //         } else for (var i in rows) {
        //             var row = rows[i];
        //             this.updateFavColor(row.user_id, row.r, row.g, row.b, function() {});
        //         }
        //     });

        // });

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

    },

    updateFavColor: function (userID, r, g, b, callback) {

        var hsl = convert.rgb.hsl(r, g, b);
        this.getColorClasses((classes) => {

            console.log(hsl);
            var colorClass = null;
            for (var i in classes) {
                var c = classes[i];
                console.log(c.max_lightness);
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
                    }
                    callback();
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