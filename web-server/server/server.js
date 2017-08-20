const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../../config');
const helpers = require('./helpers');

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
  helpers.saveImage(config.image_service_url, request.body.id)
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
  helpers.getAllImages()
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

  helpers.getImageById(id)
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
