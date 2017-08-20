const gm = require('gm');

module.exports = {
  resizeAndSave: (width, height, folder, file, cb) => {
    gm(`./originals/${file}`)
      .gravity('Center')
      .quality(50)
      .crop(width, height)
      .write(`./uploads/${folder}/${width}x${height}.png`, (err) => {
        if (err) {
          console.log(err);
        } else if (typeof cb === 'function') {
          cb();
        }
      });
  },
};
