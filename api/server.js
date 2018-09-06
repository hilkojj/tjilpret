#!/usr/bin/env nodejs

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const db = require("./database.js");
const webapp = require("./webapp.js");

app.use(bodyParser());
app.use(bodyParser.json());

app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

////////////////////////////////////////////  
//                                        //
// Public access to static content        //
//                                        //
////////////////////////////////////////////
app.use("/static_content", express.static(__dirname + "/static_content"));

////////////////////////////////////////////  
//                                        //
// API-Functions (eg. /api/login)         //
//                                        //
////////////////////////////////////////////
const api = express.Router();
app.use("/api", api);

const apiFiles = [
    "auth",
    "images",
    "users",
    "colors",
    "sound-fragments",
    "comments-and-votes",
    "notifications",
    "posts",
    "post-upload",
    "emoticons"
];
for (var i in apiFiles)
    require("./" + apiFiles[i] + ".js").apiFunctions(api);

////////////////////////////////////////////  
//                                        //
// Webapp                                 //
//                                        //
////////////////////////////////////////////
app.use("/", express.static(__dirname + "/tjilgular"));

app.get("/tjiller/:id*", (req, res) => {
    db.connection.query("SELECT * FROM users WHERE user_id = ?", [parseInt(req.params.id) || -100], (err, rows, fields) => {
        if (err || rows.length == 0) {
            console.log(err);
            webapp.show(`
				<meta name="og:url" content="https://tjilpret.tk"/>
				<meta name="og:image" content="https://tjilpret.tk/static_content/img/login_logo.png"/>
				<meta name="og:title" content="Tjiller niet gevonden?!!?"/>
			`, res);
        } else {
            var user = rows[0];
            var pf = "https://tjilpret.tk/static_content/img/login_logo.png";
            if (user.profile_pic != null)
                pf = "https://tjilpret.tk/static_content/profile_pics/med/" + user.profile_pic.replace(".gif", ".jpg");
            webapp.show(`
				<meta name="og:description" content="`+ user.bio.replace(/"/g, '&quot;') + `"/>
				<meta name="og:url" content="https://tjilpret.tk"/>\
				<meta name="og:image" content="` + pf + `"/>
				<meta name="og:title" content="`+ user.username + `"/>
			`, res);
        }
    });
});

app.get("/uplood/:id*", (req, res) => {
    db.connection.query("SELECT * FROM posts WHERE post_id = ?", [parseInt(req.params.id) || -100], (err, rows, fields) => {
        if (err || rows.length == 0) {
            console.log(err);
            webapp.show(`
				<meta name="og:url" content="https://tjilpret.tk"/>
				<meta name="og:image" content="https://tjilpret.tk/static_content/img/login_logo.png"/>
				<meta name="og:title" content="Uplood niet gevonden?!!?"/>
			`, res);
        } else {
            var post = rows[0];
            var thumbnail = "https://tjilpret.tk/static_content/post_uploads/" + post.thumbnail_path;
            webapp.show(`
				<meta name="og:description" content="`+ post.description.replace(/"/g, '&quot;') + `"/>
				<meta name="og:url" content="https://tjilpret.tk"/>\
				<meta name="og:image" content="` + thumbnail + `"/>
				<meta name="og:title" content="`+ post.title + `"/>
			`, res);
        }
    });
});

app.get("*", (req, res) => {
    webapp.show(null, res);
});

require("./chat/very-realtime.js")(io);

http.listen(8080, () => console.log("Tjillepret (Express app & Socket.io) listening on port 8080"));