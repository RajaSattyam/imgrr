/* global window document */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import HomeContainer from './containers/Home';
import GalleryContainer from './containers/Gallery';

const APP_CONTAINER_NAME = 'app-container';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={HomeContainer} />
      <Route exact path="/gallery/:image_id" component={GalleryContainer} />
    </div>
  </Router>
);

window.addEventListener('DOMContentLoaded', () => {
  let appContainer = document.getElementById(APP_CONTAINER_NAME);

  if (!appContainer) {
    appContainer = document.createElement('DIV');
    appContainer.id = APP_CONTAINER_NAME;
    document.body.appendChild(appContainer);
  }

  render(<App />, appContainer);
});
