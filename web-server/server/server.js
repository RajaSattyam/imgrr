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

app.post('/api/upload', (request, response) => new Promise((resolve, reject) => {
  Image
    .create({
      base_uri: config.image_service_url,
      filename: request.body.filename,
    }, (err, image) => {
      if (err) {
        reject(new Error(err));
      }

      resolve(image);
    });
}).then((image) => {
  response.status(200).json({
    base_uri: image.base_uri,
    filename: image.filename,
  });
}));

app.get('*', (request, response) => {
  response.header('Content-type', 'text/html');
  response.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(config.web_server_port, () => {
  console.log(`Web Server running on port ${config.web_server_port}`);
});
