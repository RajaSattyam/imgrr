/* global document */
import React, { Component } from 'react';
import request from 'axios';

import styles from './index.scss';

class Home extends Component {
  constructor(args) {
    super(args);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {

  }

  handleUpload(event) {
    event.preventDefault();
    const data = {
      id: 'test_id',
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
          <input
            type="file"
            placholder="Upload an image"
            className={styles.input}
            id="fileUpload"
          />
          <button className={styles['upload-btn']} onClick={this.handleUpload}>Upload</button>
        </div>
      </div>
    );
  }
}

export default Home;
