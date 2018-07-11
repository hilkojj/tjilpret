
const db = require("./database.js");
const utils = require("./utils.js");
const multer = require("multer");

const soundFilter = function (req, file, cb) {
    const filetypes = /mpeg|mp3|wav/;
    const mimetype = filetypes.test(file.mimetype);

    console.log(file.mimetype);

    if (mimetype) return cb(null, true);
    else cb('Error: Alleen .mp3 en .wav bestanden');
}

const soundFragmentStorage = multer.diskStorage({
    destination: __dirname + "/static_content/sound_fragments/",
    filename: function (req, file, cb) {
        cb(
            null, utils.randomInt(10000000, 99999999) + "." + (
                file.mimetype == "audio/wav" ? "wav" : "mp3"
            )
        );
    }
});

const soundFragmentUpload = multer({
    storage: soundFragmentStorage,
    limits: { fileSize: 5000000 },
    fileFilter: soundFilter
}).single("soundFragment");

module.exports = {

    apiFunctions: function (api) {

        api.post("/uploadSoundFragment", (req, res) => {

            soundFragmentUpload(req, res, (err) => {
                if (err) {
                    console.log(err);
                    return utils.sendError(res, "AAAAAAAAAAAAAAA er is iets misgegaan");
                }

                var token = parseInt(req.body.token) || 0;
                var newFileName = req.file.filename;
                db.connection.query(`UPDATE users SET sound_fragment = ? WHERE user_id = (SELECT user_id FROM tokens WHERE token = ?)`,
                    [newFileName, token], (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            return utils.sendError(res, "huuuuu er ging iets mis");
                        }
                        res.send({ success: true });
                    }
                );
            });
        });

    }

}