import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Login';
import Medication from './components/Medication';
import EditMedicationWrapper from './components/EditMedicationWrapper';
import EditDosageWrapper from './components/EditDosageWrapper';
import Route from 'react-router/lib/Route';
import UserQueries from './queries/UserQueries';
import MedicationQueries from './queries/MedicationQueries';
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
			component={EditMedicationWrapper}
			queries={UserQueries}
		/>
		<Route
			path="medication/:medicationId/editDosage/:dosageId"
			component={EditDosageWrapper}
			queries={UserQueries}
		/>
  	</Router>
);
