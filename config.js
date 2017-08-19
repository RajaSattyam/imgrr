const path = require('path');

module.exports = {
  web_server_port: 1337,
  image_service_port: 1338,
  client_path: path.join(__dirname, '/web-server/client/build'),
};
