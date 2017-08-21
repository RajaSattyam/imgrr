const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const randomString = require('randomstring');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const config = require('../config');
const helpers = require('./helpers');

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

app.get('/original/:id', (request, response) => {
  const file = fs.readFileSync(path.resolve(__dirname, 'originals', `${request.params.id}.png`));

  if (file) {
    response.status(200).send(file);
  } else {
    response.sendStatus(404);
  }
});

app.get('/:width/:height/:id', (request, response) => {
  const { width, height, id: folderName } = request.params;

  helpers.checkOriginalExists(folderName)
    .then(() => helpers.checkFileExists(folderName, width, height))
    .then((exists) => {
      if (exists) {
        return `${config.aws.s3_url}/${config.aws.bucket}/uploads/${folderName}/${width}x${height}.png`;
      }

      if (!fs.existsSync(`./tmp/${folderName}`)) {
        fs.mkdirSync(`./tmp/${folderName}`);
      }

      return helpers.resizeOriginalAndSave(
        width,
        height,
        folderName,
        helpers.uploadToS3,
      );
    })
    .then((url) => {
      response.status(200).json({ url });

      if (fs.existsSync(`./tmp/${folderName}`)) {
        rimraf(path.resolve(__dirname, 'tmp', `${folderName}`), () => {
          console.log(`Cleared ${folderName}`);
        });
      }
    })
    .catch((err) => {
      response.status(500).json({ err });
    });
});

app.post('/api/upload', upload.single('image'), (request, response) => {
  const fileName = request.file.filename;
  const id = fileName.split('.')[0];
  const sizes = Object.keys(config.sizes);

  response.status(200).json({
    id,
  });

  if (!fs.existsSync(`./tmp/${id}`)) {
    fs.mkdirSync(`./tmp/${id}`);
  }

  const promises = sizes.map(size => helpers.resizeAndSave(
    config.sizes[size].width,
    config.sizes[size].height,
    id,
    fileName,
    helpers.uploadToS3,
  ),
  );

  Promise.all(promises)
    .then(() => {
      rimraf(path.resolve(__dirname, 'tmp', `${id}`), () => {
        console.log(`Cleared ${id}`);
      });
    })
    .catch(() => {
      rimraf(path.resolve(__dirname, 'tmp', `${id}`));
      console.log(`Cleared ${id}`);
    });
});

app.listen(config.image_service_port, () => {
  console.log(`Image service running on port ${config.image_service_port}`);
});
