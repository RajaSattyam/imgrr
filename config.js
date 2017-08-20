const path = require('path');

module.exports = {
  web_server_port: 1337,
  image_service_port: 1338,
  image_service_url: 'http://localhost:1338',
  client_path: path.join(__dirname, '/web-server/client/build'),
  db: 'mongodb://localhost:27017/imgrr',
  sizes: {
    '755x450': {
      width: 755,
      height: 450,
    },
    '365x450': {
      width: 365,
      height: 450,
    },
    '365x212': {
      width: 365,
      height: 212,
    },
    '380x380': {
      width: 380,
      height: 380,
    },
    '1024x1024': {
      width: 1024,
      height: 1024,
    },
  }
};
