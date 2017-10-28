import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Login';
import Medication from './components/Medication';
import EditMedication from './components/EditMedication';
import Route from 'react-router/lib/Route';
import UserQueries from './queries/UserQueries';
import Router from 'react-router/lib/Router';

export default (
	<Router>
		<Route
			path="/"
			component={App}
			queries={UserQueries}
		/>
		<Route
			path="login"
			component={Login}
		/>
		<Route
			path="medication/:id"
			component={Medication}
			queries={UserQueries}
		/>
		<Route
			path="editMedication/:id"
			component={EditMedication}
			queries={UserQueries}
		/>
  	</Router>
);
