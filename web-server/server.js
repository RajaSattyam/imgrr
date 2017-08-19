const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const config = require('../config');

app.use('/', express.static(config.client_path));
app.use(bodyParser.json());

app.get('*', (request, response) => {
  response.header('Content-type', 'text/html');
  response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(config.web_server_port, () => {
  console.log(`Web Server running on port ${config.web_server_port}`);
});