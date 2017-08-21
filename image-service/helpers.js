const gm = require('gm');
const aws = require('aws-sdk');
const config = require('../config');
const fs = require('fs');

aws.config.loadFromPath('./aws.json');
const s3 = new aws.S3({
  params: {
    Bucket: config.aws.bucket,
  },
});

module.exports = {
  resizeAndSave: (width, height, folder, file, cb) => {
    return new Promise((resolve, reject) => {
      gm(`./originals/${file}`)
        .gravity('Center')
        .quality(50)
        .crop(width, height)
        .write(`./tmp/${folder}/${width}x${height}.png`, (err) => {
          if (err) {
            console.log(err);
            reject();
          } else if (typeof cb === 'function') {
            cb(folder, `${width}x${height}.png`);
            resolve();
          }
        });
    });
  },
  resizeOriginalAndSave: (width, height, id, cb) => {
    return new Promise((resolve, reject) => {
      gm(`./originals/${id}.png`)
        .gravity('Center')
        .quality(50)
        .crop(width, height)
        .write(`./tmp/${id}/${width}x${height}.png`, (err) => {
          if (err) {
            console.log(err);
            reject();
          } else if (typeof cb === 'function') {
            cb(id, `${width}x${height}.png`);
            resolve(`${config.aws.s3_url}/${config.aws.bucket}/uploads/${id}/${width}x${height}.png`);
          }
        });
    });
  },
  checkOriginalExists: (id) => {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(`./originals/${id}.png`)) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  },
  checkFileExists: (id, width, height) => {
    return new Promise((resolve) => {
      const params = { Bucket: config.aws.bucket, Key: `uploads/${id}/${width}x${height}.png` };
      s3.headObject(params)
        .on('success', () => {
          resolve(true);
        })
        .on('error', () => {
          resolve(false);
        })
        .send();
    });
  },
  uploadToS3: (id, fileName) => {
    const file = fs.readFileSync(`./tmp/${id}/${fileName}`);

    s3.putObject({ Key: `uploads/${id}/${fileName}`, Body: file }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },
};
