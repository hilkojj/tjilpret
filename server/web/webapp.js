
const fs = require("fs");

module.exports = {

    show: function (meta, res) {
        fs.readFile(__dirname + "/html/webapp_head.html", (err, data) => {
            if (err) {
                console.log(err);
                return res.send("Er is iets mis gegaan. Gebruik dan nog maar ff facebook ofzo");
            }
            fs.stat(__dirname + "/static_content/js/tjilpret.js", (err, stats) => {
                var mTime = 0;
                if (err) {
                    console.log(err);
                } else mTime = stats.mtime.getTime();

                var html = data.toString();
                html += "<script type=\"text/javascript\" src=\"/static_content/js/tjilpret.js" + "?version=" + mTime + "\"></script>"
                html += meta;

                html += "<title>Tjilpret web</title> </head>";
                fs.readFile(__dirname + "/html/webapp_body.html", (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.send("Er is iets mis gegaan. Gebruik dan nog maar ff facebook ofzo");
                    }
                    html += data.toString();
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Content-Length': html.length,
                        'Expires': new Date().toUTCString()
                    });
                    res.end(html);
                });
            });
        });
    }

};