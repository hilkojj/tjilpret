#!/usr/bin/env nodejs

const express = require("express");
const app = express();
const api = express.Router();
app.use("/api", api);

api.get("/", (req, res) => {

  res.send("hoi?");

});

api.get("/doei", (req, res) => {

  res.send("doei!");

});

app.listen(8080, () => console.log("API listening on port 8080"));