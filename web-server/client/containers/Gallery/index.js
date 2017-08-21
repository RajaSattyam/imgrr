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
        const { image, sizes } = response.data;
        this.setState({
          sizes,
          image,
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
    const { image } = this.state;
    const width = size.split('x')[0];
    const height = size.split('x')[1];

    request
      .get(`${image.base_uri}/${width}/${height}/${image.id}`)
      .then((response) => {
        this.setState({
          image: {
            ...this.state.image,
            url: response.data.url,
          },
          selectedHeight: height,
          selectedWidth: width,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Something went wrong while fetching the image',
        });
      });
  }

  render() {
    const { image, sizes, displayImage } = this.state;
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
                    src={`${image.base_uri}/original/${image.id}`}
                    alt={'1024x1024'}
                  />
                )
                : (null)
            }
            {sizeOptions}
          </div>
          {
            image && image.url
              ? (
                <div className={styles.preview}>
                  <img
                    src={`${image.url}`}
                    alt={`${this.state.selectedWidth}x${this.state.selectedHeight}`}
                  />
                  <a
                    href={`${image.url}`}
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
