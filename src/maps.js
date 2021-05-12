const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

const multerConfig = require(path.resolve(__dirname, "multer.config"));

var app = express();
const port = 8080;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/downloads/:mapFile", (req, res) => {
    // TODO Security checks
    res.sendFile(path.join(__dirname, `/downloads/${req.params.mapFile}`))
});

app.post("/downloads", multer(multerConfig).single("map"), (req, res) => {
    res.end()
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});