/* global window Image */
import React, { Component } from 'react';
import request from 'axios';

import styles from './index.scss';

class Home extends Component {
  constructor(args) {
    super(args);
    this.state = {
      uploadImage: null,
      uploadImageId: null,
      error: '',
      images: [],
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.validateUploadImage = this.validateUploadImage.bind(this);
  }

  componentWillMount() {

  }

  validateUploadImage(event) {
    const files = event.target.files;
    const file = files && files[0];
    if (file.type === 'image/png') {
      const img = new Image();
      const self = this;
      img.src = window.URL.createObjectURL(file);
      img.onload = function loadImage() {
        if (this.width === 1024 || this.height === 1024) {
          // Upload Image to Image Service
        } else {
          self.setState({
            error: 'Image dimensions should be 1024 x 1024',
          });
        }
      };
    } else {
      this.setState({
        error: 'Please upload an image!',
      });
    }
  }

  handleUpload(event) {
    event.preventDefault();
    const data = {
      id: this.state.uploadImageId,
    };

    request
      .post('/upload', data)
      .then(response => console.log(response))
      .catch(error => console.log(error.message));
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.uploader}>
          <div>
            {this.state.error}
          </div>
          <input
            type="file"
            placholder="Upload an image"
            className={styles.input}
            onChange={this.validateUploadImage}
          />
          <button className={styles['upload-btn']} onClick={this.handleUpload}>Upload</button>
        </div>
      </div>
    );
  }
}

export default Home;
