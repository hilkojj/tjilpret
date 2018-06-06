
const im = require('imagemagick');
const fs = require("fs");
const imagemin = require('imagemin');
const imageminGiflossy = require('imagemin-giflossy');
const sizeOf = require('image-size');
const gifFrames = require('gif-frames');

const profilePicDim = { small: { x: 80, y: 80 }, med: { x: 180, y: 180 }, large: { x: 400, y: 400 } };
const headerDim = { small: { x: 800, y: 320 }, large: { x: 1600, y: 640 } };

setTimeout(function () {


    fs.readdir(__dirname + "/static_content/profile_pics/", (err, files) => {
        if (err) {
            console.log(err);
            return;
        }

        for (var size in profilePicDim) {
            var i = 0;
            files.forEach((file, index) => {

                var filePath = __dirname + '/static_content/profile_pics/';
                var goalPath = __dirname + '/static_content/profile_pics/' + size + '/';
                var dim = profilePicDim[size];

                if (file == "small" || file == "med" || file == "large")
                    return;

                if (fs.existsSync(goalPath + file))
                    return;

                console.log(filePath + file);
                i++;

                setTimeout(function () {
                    if (file.endsWith(".gif")) {
                        sizeOf(filePath + file, (err, currentDim) => {

                            if (err) {
                                console.log(err);
                                return;
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
                                console.log(file + " optimized & resized");

                                // extract first frame to jpg
                                gifFrames({ url: filePath + file, frames: 0 }).then(function (frameData) {
                                    frameData[0].getImage().pipe(fs.createWriteStream(
                                        goalPath + file.replace(".gif", ".jpg")
                                    ));
                                    console.log("first frame of " + file + "saved to jpg");
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

                            if (err) throw err;
                            console.log(file + " done");
                        });
                    }
                }, 500 * i);
            });
        }
    });
}, 5000);

module.exports = {

    apiFunctions: function (api) { }

}