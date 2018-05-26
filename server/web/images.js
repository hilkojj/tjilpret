
const im = require('imagemagick');

module.exports = function (api) {

    api.get("/resizetest", (req, res) => {

        im.crop({

            srcPath: __dirname + "/static_content/profile_pics/harrypoep.gif",
            dstPath: __dirname + "/static_content/profile_pics/small/harrypoep.gif",
            width: 20,
            height: 20

        }, (err, result) => {

            if (err) throw err;
            res.send("gdfgdfgdf");

        });

    });

}