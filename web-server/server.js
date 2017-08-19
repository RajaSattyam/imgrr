const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../config');

const app = express();

app.use('/', express.static(config.client_path));
app.use(bodyParser.json());

app.get('/ping', (request, response) => {
  response.json({
    pong: true,
  });
});

app.post('/upload', (request, response) => {
  response.status(200).json({
    base_uri: `http://localhost:${config.image_service_port}`,
    id: request.body.id,
  });
});

app.get('*', (request, response) => {
  response.header('Content-type', 'text/html');
  response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(config.web_server_port, () => {
  console.log(`Web Server running on port ${config.web_server_port}`);
});
