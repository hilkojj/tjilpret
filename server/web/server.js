#!/usr/bin/env nodejs

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser());

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
const htmlFiles = [
  "login_register"
]
app.get("*", (req, res) => {

  fs.readFile(__dirname + "/html/webapp_head.html", (err, data) => {
    if (err) {
      console.log(err);
      return res.send("Er is iets mis gegaan. Gebruik dan nog maar ff facebook ofzo");
    }
    fs.stat(__dirname + "/static_content/js/tjilpret.js", (err, stats) => {
      var mTime = 0;
      if (err) {
        console.log(err);
      } else mTime = stats.mtime;

      var html = data.toString();
      html += "<script type=\"text/javascript\" src=\"/static_content/js/tjilpret.js" + "?version=" + mTime + "\"></script>"
      html += ' <meta name="og:description" content="Kom tjetten en tjillen! Deel je lieflingskleur en maak nieuwe vrienden!!!!!?!?"/>\
                <meta name="og:url" content="https://tjilpret.tk"/>\
                <meta name="og:title" content="Tjilpret"/>';

      html += "<title>Tjilpret web</title> <script>window.layouts = {";

      var loadedFiles = 0;
      var error = false;

      for (var i in htmlFiles) {
        const fileName = htmlFiles[i];
        fs.readFile(__dirname + "/html/" + fileName + ".html", (err, data) => {
          if (err) {
            error = true;
            console.log(err)
            return res.send("tjilpret is kapot. vertel dit pls tegen hilko en kom later terug<br><br>Excuses ga ik niet geven");
          }
          const htmlLayout = data.toString().replace(/'/g, '\\\'').replace(/"/g, '\\"');;
          html += (loadedFiles != 0 ? ", " : "") + fileName + ": \"" + htmlLayout + "\"";
          if (++loadedFiles == htmlFiles.length) {
            html += "};</script></head>";
            if (error)
              return;
            fs.readFile(__dirname + "/html/webapp_body.html", (err, data) => {
              if (err) {
                console.log(err);
                return res.send("Er is iets mis gegaan. Gebruik dan nog maar ff facebook ofzo");
              }
              res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': html.length,
                'Expires': new Date().toUTCString()
              });
              html += data.toString();
              console.log(html);
              res.end(html);
            });
          }
        });
      }
    });
  });
});

app.listen(8080, () => console.log("Tjillepret listening on port 8080"));