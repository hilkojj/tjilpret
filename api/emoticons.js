
const multer = require("multer");
const images = require("./images.js");
const db = require("./database.js");
const fs = require("fs");
const im = require('imagemagick');
const sizeOf = require('image-size');

const saveEmoticon = async (tempFilePath, name, token, categoryId) => {

    // CHECK IMAGE SIZE:
    var validSize = await (() => new Promise(resolve => {
        sizeOf(tempFilePath, (err, dim) => {
            if (err) return resolve(false);

            resolve(dim.width >= 100 && dim.width <= 600 && dim.height >= 100 && dim.height <= 600);
        });
    }))();

    if (!validSize) {
        fs.unlink(tempFilePath, err => { });
        return { error: "Plaatje moet minimaal 100x100 pixels zijn en maximaal 600x600!!!!" };
    }

    name = String(name);
    // CHECK NAME (only letters, numbers and underscore):
    var tooLong = name.length > 40;
    if (!name || /\W/.test(name)) {
        fs.unlink(tempFilePath, err => { });
        return {
            error: tooLong ?
                "Naam mag maximaal 40 tekens lang"
                :
                "Naam mag alleen letters cijfers en lage streepjes bevatten"
        };
    }

    var nameExists = await (() => new Promise(resolve => {
        db.connection.query(
            `SELECT * FROM emoticons WHERE name = ?`,
            [name],
            (err, rows, fields) => resolve(rows.length == 1)
        );
    }))();

    if (nameExists) {
        fs.unlink(tempFilePath, err => { });
        return { error: `:${name}: bestaat al, verzin een andere naam` };
    }

    // CHECK token AND categoryId
    var permission = await (() => new Promise(resolve => {
        db.connection.query(
            `SELECT * FROM tokens, emoticon_categories WHERE token = ? AND emoticon_categories.id = ?`,
            [token, categoryId],
            (err, rows, fields) => resolve(rows.length == 1)
        );
    }))();

    if (!permission) {
        fs.unlink(tempFilePath, err => { });
        return { error: "Geen juiste token of categoryId gegeven" };
    }

    // save the emoticon:
    var saved =
        await (() => new Promise(resolve => {

            im.crop({
                srcPath: tempFilePath,
                dstPath: `/emoticons/${name}.png`,
                width: 100,
                height: 100,
                format: "png"
            }, err => {
                resolve(!err);
                if (err) console.log(err);
            });
        }))()

        &&

        await (() => new Promise(resolve => {

            db.connection.query(`
                INSERT INTO emoticons
                (name, user_id, category_id, time)
                VALUES
                (?, (SELECT user_id FROM tokens WHERE token = ?), ?, ?)
            `, [name, token, categoryId, Date.now() / 1000 | 0], err => {

                    resolve(!error);
                    if (err)
                        console.log(err);
                });

        }))();

    fs.unlink(tempFilePath, err => { });
    return saved ? { success: true } : { error: "Ja potver er is iets mis gegaan" };
}

const tempStorage = multer.diskStorage({
    destination: __dirname + "/temp/emoticons/",
    filename: function (req, file, cb) {
        cb(null, utils.randomInt(10000000, 99999999) + "." + file.mimetype.replace("image/", ""));
    }
});

const upload = multer({
    storage: tempStorage,
    limits: { fileSize: 1000000 },
    fileFilter: images.imgFilter
}).single("emoticon");

function apiFunctions(api) {

    api.post("/uploadEmoticon", async (req, res) => {

        upload(req, res, async err => {

            if (err) {
                console.log(err);
                return res.send({ error: "Er ging iets mis." });
            }

            res.send(await saveEmoticon(
                req.file.filename,
                req.body.name,
                parseInt(req.body.token) || 0,
                parseInt(req.body.categoryId) || -1
            ));
        });
    });

}

module.exports = { apiFunctions: apiFunctions };
