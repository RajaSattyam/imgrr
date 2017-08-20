const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../../config');
const Image = require('./ImageModel').Image;

const app = express();

mongoose.connect(config.db);
app.use('/', express.static(config.client_path));
app.use(bodyParser.json());

app.get('/ping', (request, response) => {
  response.json({
    pong: true,
  });
});

app.post('/api/upload', (request, response) => {
  return new Promise((resolve, reject) => {
    Image
      .create({
        base_uri: config.image_service_url,
        id: request.body.id,
      }, (err, image) => {
        if (err) {
          reject(new Error(err));
        }

        resolve(image);
      });
  })
    .then((image) => {
      response.status(200).json({
        base_uri: image.base_uri,
        id: image.id,
      });
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

app.get('/api/gallery', (request, response) => {
  return new Promise((resolve, reject) => {
    Image
      .find({})
      .exec((err, images) => {
        if (err) {
          reject(new Error(err));
        }

        resolve(images);
      });
  })
    .then((images) => {
      response.status(200).json({
        size: config.sizes['380x380'],
        images: images.map(image => ({ base_uri: image.base_uri, id: image.id })),
      });
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

app.get('/api/gallery/:image_id', (request, response) => {
  const { image_id: id } = request.params;

  return new Promise((resolve, reject) => {
    Image
      .findOne({ id })
      .exec((err, image) => {
        if (err) {
          reject(new Error(err));
        }
        if (!image) {
          reject(new Error('Image does not exist'));
        }

        resolve(image);
      });
  })
    .then((image) => {
      response.status(200).json({
        sizes: config.sizes,
        image,
      });
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

app.get('*', (request, response) => {
  response.header('Content-type', 'text/html');
  response.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(config.web_server_port, () => {
  console.log(`Web Server running on port ${config.web_server_port}`);
});
