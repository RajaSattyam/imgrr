const Image = require('./ImageModel').Image;

module.exports = {
  getAllImages: () => {
    return new Promise((resolve, reject) => {
      Image
        .find({})
        .exec((err, images) => {
          if (err) {
            reject(new Error(err));
          }

          resolve(images);
        });
    });
  },
  getImageById: (id) => {
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
    });
  },
  saveImage: (baseUri, id) => {
    return new Promise((resolve, reject) => {
      Image
        .create({
          base_uri: baseUri,
          id,
        }, (err, image) => {
          if (err) {
            reject(new Error(err));
          }

          resolve(image);
        });
    });
  },
};
