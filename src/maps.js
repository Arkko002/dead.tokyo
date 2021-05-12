import multerConfig from "./multer.config";

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const passwords = JSON.parse(fs.readFileSync("passwords.json", "utf8"));

var app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/downloads", (req, res) => {
    res.render("downloads.html");
});

app.get("/downloads/:mapFile", (req, res) => {
    // TODO Security checks
    res.sendFile(path.join(__dirname, `/downloads/${req.params.mapFile}`))
});

app.post("/downloads", multer(multerConfig).single("map"), (req, res) => {
    const hasCorrectPassword = Object.values(passwords).includes(req.body.password);
    if(!hasCorrectPassword) {
        res.end();
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});