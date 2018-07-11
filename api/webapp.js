const fs = require("fs");

module.exports = {

    show: function (meta, res) {

        fs.readFile(__dirname + "/tjilgular/index.html", (err, data) => {
            if (err) {
                console.log(err);
                return res.send("Klein foutje.");
            }

            var html = data.toString();
            if (meta != null)
                html = html.replace(/(<!-- default-meta -->)((.|\n|\r)*)(<!-- end default-meta -->)/, meta);

            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': html.length,
                'Expires': new Date().toUTCString()
            });
            res.end(html);
        });
    }

};
