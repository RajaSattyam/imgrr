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
      uploadImageId: null,
      error: '',
      images: [],
      gallerySize: null,
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
          const data = new FormData();
          data.append('image', file);
          request.create({
            headers: {
              'content-type': 'multipart/form-data',
            },
          }).post('http://localhost:1338/api/upload', data)
            .then((response) => {
              self.setState({
                uploadImageId: response.data.id,
              });
            })
            .catch((error) => {
              self.setState({
                error: error.message || 'Something went wrong! Please try again',
              });
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
    const data = {
      id: this.state.uploadImageId,
    };

    request
      .post('/api/upload', data)
      .then((response) => {
        this.setState({
          images: [response.data, ...this.state.images],
        });
      })
      .catch(error => console.log(error.message));
  }

  render() {
    const images = this.state.images.map((image) => {
      return (
        <Link to={`/gallery/${image.id}`}>
          <img
            src={`${image.base_uri}/${this.state.gallerySize.width}/${this.state.gallerySize.height}/${image.id}`}
            alt={`${'id'}`}
          />
        </Link>
      );
    });
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.uploader}>
            <div>
              {this.state.error}
              {this.state.uploadImageId}
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
        <div className={styles['image-container']}>
          {images}
        </div>
      </div>
    );
  }
}

export default Home;
