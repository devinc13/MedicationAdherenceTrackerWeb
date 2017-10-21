import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Route from 'react-router/lib/Route';
import UserQueries from './queries/UserQueries';

export default (
  <Route
    path="/"
    component={App}
    queries={UserQueries}
  >
  </Route>
);