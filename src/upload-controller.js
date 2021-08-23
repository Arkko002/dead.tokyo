const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multer = require('multer');

const multerConfig = require('./multer-config');
const uploadService = require('./upload-service');
const uploadError = require('./upload-error');

const app = express();
const port = 42069;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.post('/upload', multer(multerConfig).single('map'), async (req, res) => {
  let contextObj = {
    forwardedFor: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    password: req.body.password,
    file: req.body.file,
  };

  try {
    if (await uploadService.uploadFile(contextObj)) {
      res.send('File uploaded');
    }
  } catch (err) {
    if (err instanceof uploadError) {
      res.status(err.code).send(err.message);
    } else {
      res.status(500).end();
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
