const ThumbnailGenerator = require('video-thumbnail-generator').default;
const getDuration = require("get-video-duration");
const ffmpeg = require('fluent-ffmpeg');

const createThumbnail = (filePath, destPath, maxWidth, maxHeight, percentage) => new Promise(resolve => {

    ffmpeg(filePath).ffprobe(async (err, data) => {

        if (err) console.log(err);

        var size = "300x300";
        if (data.streams && 0 in data.streams) {
            var s = data.streams[0];
            var width = parseInt(s.coded_width);
            var height = parseInt(s.coded_height);

            if (width > maxWidth) {
                height *= maxWidth / width;
                height |= 0;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width *= maxHeight / height;
                width |= 0;
                height = maxHeight;
            }

            size = width + "x" + height;
        }

        var tg = new ThumbnailGenerator({
            sourcePath: filePath,
            thumbnailPath: destPath
        });

        var filename = await tg.generateOneByPercent(Math.max(1, Math.min(percentage * 100, 99)), { size });

        var newPath = destPath + "/" + filename;

        resolve(newPath);
    });
});

module.exports = {
    createThumbnail,
    getDuration: filePath => getDuration(filePath)
}
