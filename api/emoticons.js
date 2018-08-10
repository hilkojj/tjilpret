
const multer = require("multer");
const images = require("./images.js");
const db = require("./database.js");
const fs = require("fs");
const im = require('imagemagick');
const sizeOf = require('image-size');
const utils = require('./utils.js');

const createFriendshipWithEmoticonCollectionUser = userId => {

    var emoticonCollectionUser = 1020;

    db.connection.query(`
        INSERT INTO friendships SET ?
    `, {
        accepter_id: userId,
        inviter_id: emoticonCollectionUser,
        since: Date.now() / 1000 | 0
    }, (err, results, fields) => {
        if (err) console.log(err);
    });
};

const emoticon = row => ({
    name: row.name,
    timesUsed: row.times_used,
    uploaderId: row.user_id,
    uploadedOn: row.time
});

const getCategories = () => new Promise(resolve => {

    db.connection.query(`SELECT * FROM emoticon_categories`, [], (err, rows, fields) => {
        if (err) console.log(err);

        var categories = {};

        for (var row of rows) categories[row.id] = {
            id: row.id,
            name: row.name,
            exampleEmoticon: row.example_emoticon
        }
        resolve(categories);
    });

});

const registerEmoticonUses = text => {

    var matches = text.match(/:(\w*?):/g);

    if (!matches) return;

    var occurrencesPerName = {};
    for (var match of matches) {
        var name = match.substr(1, match.length - 2);

        if (name in occurrencesPerName)
            occurrencesPerName[name]++;
        else
            occurrencesPerName[name] = 1;
    }

    var namesPerOccurences = {};
    for (var name in occurrencesPerName) {
        var o = occurrencesPerName[name];

        var list = namesPerOccurences[o];
        if (list) list.push(name);
        else namesPerOccurences[o] = [name];
    }

    for (var occurences in namesPerOccurences) {
        names = namesPerOccurences[occurences];
        db.connection.query(`
            UPDATE emoticons SET times_used = times_used + ?
            WHERE name IN (?)
        `, [occurences, names], (err, results, fields) => {
                if (err) console.log(err);
            }
        );
    }

    console.log("emoticons used:", Object.keys(occurrencesPerName));
};

const saveEmoticon = async (tempFilePath, name, token, categoryId) => {

    var maxSize = 2000;

    // CHECK IMAGE SIZE:
    var validSize = await (() => new Promise(resolve => {
        sizeOf(tempFilePath, (err, dim) => {
            if (err) {
                console.log(err);
                return resolve(false);
            }

            resolve(dim.width >= 100 && dim.width <= maxSize && dim.height >= 100 && dim.height <= maxSize);
        });
    }))();

    if (!validSize) {
        fs.unlink(tempFilePath, err => { });
        return { error: `Plaatje moet minimaal 100x100 pixels zijn en maximaal ${maxSize}x${maxSize}!!!!` };
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
                dstPath: __dirname + `/static_content/emoticons/${name.toLowerCase()}.png`,
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

                    resolve(!err);
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
            if (!req.file) return res.send({ error: "Er is niks geuplood" });

            res.send(await saveEmoticon(
                __dirname + "/temp/emoticons/" + req.file.filename,
                req.body.name,
                parseInt(req.body.token) || 0,
                parseInt(req.body.categoryId) || -1
            ));
        });
    });

    api.post("/emoticons", async (req, res) => {

        var categories = await getCategories();
        for (var id in categories) categories[id].emoticons = [];

        db.connection.query(`
            SELECT
                emoticons.*
            FROM 
                emoticons
            
            JOIN tokens ON token = ?
            
            LEFT JOIN friendships ON (
                (inviter_id = tokens.user_id AND accepter_id = emoticons.user_id)
                OR
                (accepter_id = tokens.user_id AND inviter_id = emoticons.user_id)
            )
            
            WHERE emoticons.user_id = tokens.user_id OR emoticons.user_id = friendships.inviter_id OR emoticons.user_id = friendships.accepter_id
            `, [parseInt(req.body.token) || 0], (err, rows, fields) => {

                if (err) console.log(err);

                for (var row of rows) {
                    categories[row.category_id].emoticons.push(emoticon(row));
                }
                res.send(Object.values(categories));
            }
        );

    });

    api.post("/emoticonsOfUser/:id", (req, res) => {

        var id = parseInt(req.params.id) || 0;

        db.connection.query(`SELECT * FROM emoticons WHERE user_id = ?`, [id], (err, rows, fields) => {

            if (err) console.log(err);
            var emoticons = [];

            for (var row of rows) emoticons.push(emoticon(row));
            res.send(emoticons)

        });

    });

    api.post("/deleteEmoticon", (req, res) => {

        var token = parseInt(req.body.token) || 0;
        var emoticonName = String(req.body.emoticonName);

        db.connection.query(`
            DELETE FROM emoticons 
            WHERE name = ? AND user_id = (SELECT user_id FROM tokens WHERE token = ?)
        `, [emoticonName, token], (err, results, fields) => {

                if (err) {
                    console.log(err);
                    return res.send({ success: false });
                }

                var deleted = results.affectedRows == 1;
                if (deleted)
                    fs.unlink(__dirname + "/static_content/emoticons/" + emoticonName.toLowerCase() + ".png", () => { });

                res.send({ success: deleted });
            }
        );
    });

}

module.exports = { 
    apiFunctions: apiFunctions, 
    registerEmoticonUses: registerEmoticonUses,
    createFriendshipWithEmoticonCollectionUser: createFriendshipWithEmoticonCollectionUser
};
