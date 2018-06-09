
const im = require('imagemagick');
const fs = require("fs");
const imagemin = require('imagemin');
const imageminGiflossy = require('imagemin-giflossy');
const sizeOf = require('image-size');
const gifFrames = require('gif-frames');
const multer = require("multer");
const path = require('path');
const utils = require("./utils.js");
const db = require("./database.js");

const profilePicDim = { small: { x: 80, y: 80 }, med: { x: 180, y: 180 }, large: { x: 400, y: 400 } };
const headerDim = { small: { x: 800, y: 320 }, large: { x: 1600, y: 640 } };

function saveResizedImage(file, filePath, dimName, dim, doneCallback) {
    var goalPath = filePath + dimName + "/";
    if (file.endsWith(".gif")) {
        sizeOf(filePath + file, (err, currentDim) => {

            if (err) {
                console.log(err);
                return doneCallback(false);
            }
            var w = currentDim.width;
            var h = currentDim.height;

            var tooBig = w > dim.x && h > dim.y;
            if (tooBig ? (w < h) : (h < w)) {
                w = dim.x;
                h = w * (currentDim.height / currentDim.width);
            } else {
                h = dim.y;
                w = h * (currentDim.width / currentDim.height);
            }
            imagemin([filePath + file], goalPath, {
                use: [imageminGiflossy({
                    optimize: '1',
                    resize: w + "x" + h
                })]
            }).then(() => {
                console.log("gif size: " + w + "x" + h);
                console.log(goalPath + file + " optimized & resized");

                // extract first frame to jpg
                gifFrames({ url: goalPath + file, frames: 0 }).then(function (frameData) {
                    frameData[0].getImage().pipe(fs.createWriteStream(
                        goalPath + file.replace(".gif", ".jpg")
                    ));
                    console.log("first frame of " + file + "saved to jpg");
                    doneCallback(true);
                });
            });
        });
    } else {
        im.crop({
            srcPath: filePath + file,
            dstPath: goalPath + file,
            width: dim.x,
            height: dim.y
        }, (err, result) => {

            if (err) {
                console.log(err);
                return doneCallback(false);
            };
            console.log(file + " done");
            doneCallback(true);
        });
    }
}

function saveMultipleImageSizes(file, filePath, dimensions, callback) {

    var done = 0;
    var toDo = 0;
    var failed = false;
    for (var i in dimensions) toDo++;
    var doneCallback = function (success) {
        if (!success) {
            if (failed) return; // already failed earlier
            failed = true;
            return callback(false);
        }
        if (++done == toDo) callback(true);
    }

    for (var dimName in dimensions) {
        var dim = dimensions[dimName];
        saveResizedImage(file, filePath, dimName, dim, doneCallback);
    }
}

const profilePicStorage = multer.diskStorage({
    destination: __dirname + "/static_content/profile_pics/",
    filename: function (req, file, cb) {
        cb(null, utils.randomInt(10000000, 99999999) + "." + file.mimetype.replace("image/", ""));
    }
});

const profilePicUpload = multer({
    storage: profilePicStorage,
    limits: { fileSize: 15000000 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype) return cb(null, true);
        else cb('Error: Aleen platjes');
    }
}).single("profilePic");

module.exports = {

    apiFunctions: function (api) {

        api.post("/uploadProfilePic", (req, res) => {
            profilePicUpload(req, res, (err) => {
                if (err) {
                    console.log(err);
                    return utils.sendError(res, "AAAAAAAAAAAAAAA er is iets misgegaan");
                }
                console.log(req.body);
                var newFileName = req.file.filename;
                saveMultipleImageSizes(newFileName, req.file.destination, profilePicDim, function (success) {
                    if (success) {

                        var token = parseInt(req.body.token) || 0;

                        db.connection.query(`UPDATE users SET profile_pic = ? WHERE user_id = (SELECT user_id FROM tokens WHERE token = ?)`,
                            [newFileName, token], (err, results, fields) => {
                                if (err) {
                                    console.log(err);
                                    return utils.sendError(res, "huuuuu er ging iets mis");
                                }
                                res.send({ success: true });
                            }
                        );
                    } else utils.sendError(res, "Platje opslaan mislukt");
                });
            });
        }
        );
    }

}