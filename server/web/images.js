
const im = require('imagemagick');
const fs = require("fs");
const imagemin = require('imagemin');
const imageminGiflossy = require('imagemin-giflossy');
const sizeOf = require('image-size');

const profilePicDim = { small: 80, medium: 180, large: 360 };

setTimeout(function () {


    fs.readdir(__dirname + "/static_content/profile_pics/", (err, files) => {
        if (err) {
            console.log(err);
            return res.send("kjkldjksdjflskdgjfslkfj");
        }

        var i = 0;
        files.forEach((file, index) => {

            var filePath = __dirname + '/static_content/profile_pics/';
            var goalPath = __dirname + '/static_content/profile_pics/small/';
            var dim = profilePicDim.small;

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

                        var tooBig = w > dim && h > dim;
                        if (tooBig ? (w < h) : (h < w)) {
                            w = dim;
                            h = w * (currentDim.height / currentDim.width);
                        } else {
                            h = dim;
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
                        });
                    });
                } else {

                    im.crop({
                        srcPath: filePath + file,
                        dstPath: goalPath + file,
                        width: dim,
                        height: dim
                    }, (err, result) => {

                        if (err) throw err;
                        console.log(file + " done");
                    });
                }
            }, 500 * i);
        });

    });
}, 5000);
module.exports = function (api) {

}