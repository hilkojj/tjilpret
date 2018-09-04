
const mimeToExt = require("mime-to-extensions");
const fs = require("fs");
const utils = require("./utils.js");
const db = require("./database.js");
const images = require("./images.js");
const multer = require("multer");
const emoticons = require("./emoticons.js");

const tempStorage = multer.diskStorage({
    destination: __dirname + "/temp/posts_uploads/",
    filename: function (req, file, cb) {
        cb(null, utils.randomInt(10000000, 99999999) + "." + mimeToExt.extension(file.mimetype));
    }
});

//mp4|webm|ogg

const imgUpload = multer({
    storage: tempStorage,
    limits: { fileSize: 1000000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;

        if (filetypes.test(file.mimetype)) return cb(null, true);
        else cb(file.mimetype + ' wordt nit ondersteund');
    }
}).single("file");

const createPost = (
    token, title, description, categoryId, type, filePath, thumbnailPath, duration
) => new Promise(async resolve => {

    const error = message => {
        fs.unlink(filePath, err => { });
        fs.unlink(thumbnailPath, err => { });
        resolve({ error: message });
    }

    title = String(title);
    description = String(description);

    if (!title || !description) return error("Pls een titel en een descriptie invullen");

    var id = await utils.createEntity(null, token);
    if (id == null) return error("Token onjuist?!?!");

    const dir = __dirname + "/static_content/post_uploads/" + id;
    fs.mkdir(dir, err => {
        if (err) {
            console.log(err);
            return error("poepies er ging iets mis");
        }

        const file = `item_${id}.${filePath.split(".")[1]}`;
        const thumbnail = `thumbnail.${thumbnailPath.split(".")[1]}`;
    
        fs.rename(filePath, `${dir}/${file}`, err => {
    
            if (err) console.log(err);
            else fs.rename(thumbnailPath, `${dir}/${thumbnail}`, err => {
    
                if (err) console.log(err);
                else db.connection.query(`
                    INSERT INTO posts SET ?
                `, {
    
                        post_id: id,
                        category_id: categoryId,
                        title: title.replace(/\r?\n|\r/g, ""),
                        description: utils.removeExtraNewlines(description),
                        uploaded_on: Date.now() / 1000 | 0,
                        type,
                        path: id + "/" + file,
                        thumbnail_path: id + "/" + thumbnail,
                        duration
    
                    }, (err, r, f) => {
    
                        if (err) {
                            console.log(err);
                            return error("Er is iets mis gegaan");
                        }
    
                        resolve({ success: true, id });
                        emoticons.registerEmoticonUses(description);

                        // remove temp files:
                        fs.unlink(filePath, err => { });
                        fs.unlink(thumbnailPath, err => { });
                    }
                );
            });
        });
    });

});

module.exports = {

    apiFunctions: api => {

        api.post("/uploadImagePost", (req, res) => {

            imgUpload(req, res, async err => {

                if (err) {
                    console.log(err);
                    return res.send({ error: "Er ging iets mis." });
                }
                if (!req.file) return res.send({ error: "Er is niks geuplood" });

                var isGif = req.file.mimetype == "image/gif";

                // COMPRESS IMAGE:
                if (!isGif) await images.compressImg(req.file.path, 2000, 2000);

                // ROTATE IMAGE:
                var rotate = parseInt(req.body.rotate);
                if (req.body.rotate != 0)
                    await images.rotateImg(req.file.path, Math.max(-360, Math.min(360, rotate * 90)));

                // SAVE THUMBNAIL:
                var thumbnailPath = await images.createThumbnail(
                    isGif, req.file.path, 
                    __dirname + "/temp/post_thumbnails/" + req.file.filename, 
                    280, 300
                );

                res.send(await createPost(
                    parseInt(req.body.token),
                    req.body.title,
                    req.body.description,
                    parseInt(req.body.categoryId),
                    isGif ? "gif" : "img",
                    req.file.path, thumbnailPath, 0
                ));

            });

        });

    }

};
