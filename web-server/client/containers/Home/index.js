/* global window Image FormData */
import React, { Component } from 'react';
import request from 'axios';
import { Link } from 'react-router-dom';

import styles from './index.scss';

class Home extends Component {
  constructor(args) {
    super(args);
    this.state = {
      uploadImage: null,
      error: '',
      images: [],
      gallerySize: null,
      buttonDisabled: true,
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.validateUploadImage = this.validateUploadImage.bind(this);
  }

  componentWillMount() {
    request
      .get('/api/gallery')
      .then((response) => {
        this.setState({
          gallerySize: response.data.size,
          images: response.data.images,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  validateUploadImage(event) {
    const files = event.target.files;
    const file = files && files[0];
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      const img = new Image();
      const self = this;
      img.src = window.URL.createObjectURL(file);
      img.onload = function loadImage() {
        if (this.width === 1024 || this.height === 1024) {
          self.setState({
            uploadImage: file,
            buttonDisabled: false,
          });
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

    const data = new FormData();
    data.append('image', this.state.uploadImage);

    request
      .create({
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .post('http://localhost:1338/api/upload', data)
      .then((response) => {
        return request.post('/api/upload', {
          id: response.data.id,
        });
      })
      .then((response) => {
        this.setState({
          images: [response.data, ...this.state.images],
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message || 'Something went wrong! Please try again',
        });
      });
  }

  render() {
    const images = this.state.images.map((image) => {
      return (
        <Link to={`/gallery/${image.id}`}>
          <img
            src={`${image.base_uri}/original/${image.id}`}
            alt={`${'id'}`}
          />
        </Link>
      );
    });
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
            accept="image/*"
            onChange={this.validateUploadImage}
          />
          <button
            className={styles['upload-btn']}
            onClick={this.handleUpload}
            disabled={this.state.buttonDisabled}
          >
            Upload
          </button>
        </div>
        <div className={styles['image-container']}>
          {images}
        </div>
      </div>
    );
  }
}

export default Home;
