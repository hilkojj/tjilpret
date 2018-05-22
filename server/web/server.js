#!/usr/bin/env nodejs

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser());
app.use(bodyParser.json());

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
  "auth"
];
for (var i in apiFiles)
  require("./" + apiFiles[i] + ".js")(api);


////////////////////////////////////////////  
//                                        //
// Every other path will serve the webapp //
//                                        //
////////////////////////////////////////////
app.get("*", (req, res) => {

  // serve web-app html

  // & add metadata to html based on req.url (example: if req.url = 'profile/*name*' then provide profile pic in "og:image")
  // <meta property="og:title" content="username" />
  // <meta property="og:type" content="video.movie" />
  // <meta property="og:url" content="http://www.imdb.com/title/tt0117500/" />
  // <meta property="og:image" content="http://ia.media-imdb.com/images/rock.jpg" />
  fs.readFile(__dirname + "/webapp.html", (err, data) => {

    if (err) {
      console.log("Cannot find webapp.html");
      console.log(err);
      res.send("Er is iets mis gegaan. Gebruik dan nog maar ff facebook ofzo");
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': data.length,
      'Expires': new Date().toUTCString()
    });
    res.end(data);
    console.log(data);
  });

});

app.listen(8080, () => console.log("Tjillepret listening on port 8080"));