const app = require("../app");
const multer = require("multer");

const multerConfig = require("./multer-config");
const { uploadService } = require("../services");
const { AppError } = require("../error");

const port = 42069;
app.set("port", port);

app.post("/upload", multer(multerConfig).single("map"), async (req, res) => {
  let contextObj = {
    forwardedFor: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    password: req.body.password,
    file: req.file,
  };

  try {
    if (await uploadService.uploadFile(contextObj)) {
      res.send("File uploaded");
    }
  } catch (err) {
    // TODO Error handler
    if (err instanceof AppError) {
      res.status(err.code).send(err.message);
    } else {
      console.error(err);
      res.status(500).end();
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
