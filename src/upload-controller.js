const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const multer = require("multer");

const multerConfig = require("./multer-config");
const uploadService = require("./upload-service");
const path = require("path");

const app = express();
const port = 8080;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());


app.post("/", multer(multerConfig).single("map"), async (req, res) => {
    try {
        await uploadService.uploadRoute(req, res);
    } catch (err) {
        res.status(500).end()
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
