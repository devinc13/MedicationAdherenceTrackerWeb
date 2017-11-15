import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Login';
import Signup from './components/Signup';
import Medication from './components/Medication';
import EditMedicationWrapper from './components/EditMedicationWrapper';
import EditDosageWrapper from './components/EditDosageWrapper';
import GraphWrapper from './components/GraphWrapper';
import Route from 'react-router/lib/Route';
import UserQueries from './queries/UserQueries';
import MedicationQueries from './queries/MedicationQueries';
import Router from 'react-router/lib/Router';

const checkForErrors = ({ error, props, element }) => {
	if (error) {
		window.location.href = "#/login";
	}

	if (!props) {
		return undefined;
	}

	return React.cloneElement(element, props);
}

export default (
	<Router>
		<Route
			path="/"
			component={App}
			queries={UserQueries}
			render={checkForErrors}
		/>
		<Route
			path="/adherence"
			component={GraphWrapper}
			queries={UserQueries}
			render={checkForErrors}
		/>
		<Route
			path="login"
			component={Login}
		/>
		<Route
			path="signup"
			component={Signup}
		/>
		<Route
			path="medication/:id"
			component={Medication}
			queries={UserQueries}
			render={checkForErrors}
		/>
		<Route
			path="editMedication/:id"
			component={EditMedicationWrapper}
			queries={UserQueries}
			render={checkForErrors}
		/>
		<Route
			path="medication/:medicationId/editDosage/:dosageId"
			component={EditDosageWrapper}
			queries={UserQueries}
			render={checkForErrors}
		/>
  	</Router>
);
