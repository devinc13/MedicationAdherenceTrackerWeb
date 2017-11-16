import 'babel-polyfill';

import App from './components/App';
import routes from './routes';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router';
import Relay from 'react-relay/classic';
import useRelay from 'react-router-relay';
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware';
import useRouterHistory from 'react-router/lib/useRouterHistory';
import createHashHistory from 'history/lib/createHashHistory';

const history = useRouterHistory(createHashHistory)({ queryKey: false });
const APP_PORT = process.env.PORT || 3000;

ReactDOM.render(
  <Router
    history={history}
    routes={routes}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  />,
  document.getElementById('root')
);

var token = localStorage.getItem('adherence_tracker_jwt_token');

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('https://localhost:' + APP_PORT + '/graphql', {
    headers: {
      Authorization: token
    }
  })
);
