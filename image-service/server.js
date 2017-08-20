const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const randomString = require('randomstring');
const fs = require('fs');
const gm = require('gm');
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

function resizeAndSave(width, height, folder, file) {
  gm(`./originals/${file}`)
    .gravity('Center')
    .crop(width, height)
    .write(`./uploads/${folder}/${width}x${height}.png`, (err) => {
      if (err) {
        console.log(err);
      }
    });
}

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
  const fileName = request.file.filename;
  const folderName = fileName.split('.')[0];

  response.status(200).json({
    filename: request.file.filename,
  });

  if (!fs.existsSync(`./uploads/${folderName}`)) {
    fs.mkdirSync(`./uploads/${folderName}`);
  }

  resizeAndSave(1024, 1024, folderName, fileName);
  resizeAndSave(755, 450, folderName, fileName);
  resizeAndSave(365, 450, folderName, fileName);
  resizeAndSave(365, 212, folderName, fileName);
  resizeAndSave(380, 380, folderName, fileName);
});

app.listen(config.image_service_port, () => {
  console.log(`Image service running on port ${config.image_service_port}`);
});
