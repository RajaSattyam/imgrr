const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const randomString = require('randomstring');
const config = require('../config');

const app = express();
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './originals');
  },
  filename(req, file, cb) {
    cb(null, `${randomString.generate(11)}.png`);
  },
});
const upload = multer({ storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/ping', (request, response) => {
  response.json({
    pong: true,
  });
});

app.post('/api/upload', upload.single('image'), (request, response) => {
  response.status(200).json({
    filename: request.file.filename,
  });
  // Move the file from /originals to /uploads with the filename as folder name
  // Resize the file and put it in the same folder.
});

app.post('/upload');

app.listen(config.image_service_port, () => {
  console.log(`Image service running on port ${config.image_service_port}`);
});
