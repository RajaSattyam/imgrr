const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  base_uri: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = {
  Image,
};
