#!/usr/bin/env nodejs

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./database.js");
const webapp = require("./webapp.js");

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
	"auth",
	"images",
	"users",
	"colors"
];
for (var i in apiFiles)
	require("./" + apiFiles[i] + ".js").apiFunctions(api);


////////////////////////////////////////////  
//                                        //
// 404 error for static content           //
//                                        //
////////////////////////////////////////////
app.get("/static_content/*", (req, res) => {
	res.status(404).send("Je zit hier helemaal verkeerd<br><br>Ga naar de <a href=\"https://tjilpret.tk\">hoompagina</a>");
});

////////////////////////////////////////////  
//                                        //
// Webapp                                 //
//                                        //
////////////////////////////////////////////
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
				<meta name="og:description" content="`+ user.bio + `"/>
				<meta name="og:url" content="https://tjilpret.tk"/>\
				<meta name="og:image" content="` + pf + `"/>
				<meta name="og:title" content="`+ user.username + `"/>
			`, res);
		}
	});
});

app.get("*", (req, res) => {
	webapp.show(`
		<meta name="og:description" content="Kom tjetten en tjillen! Deel je lieflingskleur en maak nieuwe vrienden!!!!!?!?"/>
		<meta name="og:url" content="https://tjilpret.tk"/>
		<meta name="og:image" content="https://tjilpret.tk/static_content/img/login_logo.png"/>
		<meta name="og:title" content="Tjilpret"/>
	`, res);
});

app.listen(8080, () => console.log("Tjillepret listening on port 8080"));