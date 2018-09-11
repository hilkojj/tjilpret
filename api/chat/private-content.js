const db = require("../database");
var path = require('path');

module.exports = privateContent => {

    privateContent.get("/chat_wallpaper/:filename", (req, res) => {

        var token = req.cookies.token | 0;
        var filename = String(req.params.filename);

        if (!token) {
            res.setHeader("Cache-Control", "no-cache");
            return res.status(400).send("No token cookie found");
        }

        db.connection.query(`
            SELECT wallpaper FROM users
            JOIN tokens ON token = ? AND tokens.user_id = users.user_id
            WHERE wallpaper = ?`, [token, filename], (err, rows, fields) => {

                if (err) {
                    console.log(err);
                    res.setHeader("Cache-Control", "no-cache");
                    return res.status(500).send("Oepsie er ging iets mis!?!?");
                }

                if (rows.length == 0) {
                    res.setHeader("Cache-Control", "no-cache");
                    return res.status(403).send("Jij mag deze foto nit zien!!");
                }
                filename = rows[0].wallpaper;
                res.setHeader("Cache-Control", "private, only-if-cached, max-age=999999");
                res.sendFile(path.resolve(`${__dirname}/../private_content/chat_wallpapers/${filename}`));

            }
        );

    });

    privateContent.get("/group_pic/:dim/:filename", (req, res) => {

        var token = req.cookies.token | 0;
        var dim = req.params.dim == "small" ? "small" : (req.params.dim == "med" ? "med" : "large");
        var filename = String(req.params.filename);

        if (!token) {
            res.setHeader("Cache-Control", "no-cache");
            return res.status(400).send("No token cookie found");
        }

        // console.log("User with token:", token, "tries to download:", filename);

        // check if user is allowed to download this image:
        db.connection.query(
            `SELECT group_pic FROM chats chat
            JOIN chat_members member ON chat.chat_id = member.chat_id AND member.left_timestamp IS NULL
            JOIN tokens ON tokens.token = ? AND tokens.user_id = member.user_id
            WHERE group_pic = ?`, [token, filename], (err, rows, fields) => {

                if (err) {
                    console.log(err);
                    res.setHeader("Cache-Control", "no-cache");
                    return res.status(500).send("Oepsie er ging iets mis!?!?");
                }

                if (rows.length == 0) {
                    res.setHeader("Cache-Control", "no-cache");
                    return res.status(403).send("Jij mag deze foto nit zien!!");
                }
                filename = rows[0].group_pic;
                
                // keep this file in a private cache, for a long time because it won't change.
                res.setHeader("Cache-Control", "private, only-if-cached, max-age=999999");
                res.sendFile(path.resolve(`${__dirname}/../private_content/group_pics/${dim}/${filename}`));
            }
        )
    });

}