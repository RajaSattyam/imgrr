import React, { Component } from 'react';
import request from 'axios';
import { Link } from 'react-router-dom';

import styles from './index.scss';

class Gallery extends Component {
  constructor(args) {
    super(args);
    this.state = {
      sizes: null,
      image: null,
      selectedWidth: 1024,
      selectedHeight: 1024,
      error: '',
    };

    this.loadImage = this.loadImage.bind(this);
  }
  componentWillMount() {
    request
      .get(`/api/gallery/${this.props.match.params.image_id}`)
      .then((response) => {
        this.setState({
          sizes: response.data.sizes,
          image: response.data.image,
        });
      })
      .catch((error) => {
        this.setState({
          error,
        });
      });
  }

  loadImage(event) {
    const size = event.target.getAttribute('name');
    const width = size.split('x')[0];
    const height = size.split('x')[1];

    this.setState({
      selectedHeight: height,
      selectedWidth: width,
    });
  }

  render() {
    const { image, sizes } = this.state;
    const gallerySizes = sizes && Object.keys(sizes);
    const sizeOptions = gallerySizes && gallerySizes.map(size => (
      <span
        className={styles['crop-option']}
        name={size}
        onClick={this.loadImage}
        role="link"
        tabIndex="-1"
      >
        {size}
      </span>
    ));
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.back}>
          Go back
        </Link>
        <div className={styles['gallery-container']}>
          <div className={styles['cropping-toolbox']}>
            {
              image
                ? (
                  <img
                    className={styles.original}
                    src={`${image.base_uri}/1024/1024/${image.id}`}
                    alt={'1024x1024'}
                  />
                )
                : (null)
            }
            {sizeOptions}
          </div>
          {
            image
              ? (
                <div className={styles.preview}>
                  <img
                    src={`${image.base_uri}/${this.state.selectedWidth}/${this.state.selectedHeight}/${image.id}`}
                    alt={`${this.state.selectedWidth}x${this.state.selectedHeight}`}
                  />
                  <a
                    href={`${image.base_uri}/${this.state.selectedWidth}/${this.state.selectedHeight}/${image.id}`}
                    target="_blank"
                  >
                    {'View Full Size'}
                  </a>
                </div>
              )
              : (null)
          }
        </div>
      </div>
    );
  }
}

export default Gallery;
