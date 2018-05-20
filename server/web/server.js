#!/usr/bin/env nodejs

const express = require("express");
const app = express();

// public access to static content (like stylesheets or logos)
app.use("/static_content", express.static(__dirname + "/static_content"));

// API functions
const api = express.Router();
app.use("/api", api);
const apiFiles = [
  "auth"
];
for (var i in apiFiles)
  require("./" + apiFiles[i] + ".js")(api);

// Everything else will serve the webapp
app.get("*", (req, res) => {

  // serve web-app html

  // & add metadata to html based on req.url (example: if req.url = 'profile/*name*' then provide profile pic in "og:image")
  // <meta property="og:title" content="username" />
  // <meta property="og:type" content="video.movie" />
  // <meta property="og:url" content="http://www.imdb.com/title/tt0117500/" />
  // <meta property="og:image" content="http://ia.media-imdb.com/images/rock.jpg" />
  res.send(req.url);

});

app.listen(8080, () => console.log("Tjillepret listening on port 8080"));