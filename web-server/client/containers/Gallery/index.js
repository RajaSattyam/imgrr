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
      error: '',
    };
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

  render() {
    const { image, sizes } = this.state;
    const gallerySizes = sizes && Object.keys(sizes);
    const images = gallerySizes && gallerySizes.map(size => (
      <img
        src={`${image.base_uri}/${sizes[size].width}/${sizes[size].height}/${image.id}`}
        alt={size}
        height={sizes[size].height}
        width={sizes[size].width}
      />
    ));
    return (
      <div>
        <div>
          <Link to="/">
            Go back
          </Link>
        </div>
        <div className={styles['gallery-container']}>
          {images}
        </div>
      </div>
    );
  }
}

export default Gallery;
