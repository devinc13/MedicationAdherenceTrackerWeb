import React from 'react';
import Relay from 'react-relay';

import MedicationList from './MedicationList';

class App extends React.Component {
  render() {
    var user = this.props.user;
    return (
      <div>
        <h1>Medication Adherence Tracker</h1>
        Welcome {this.props.user.name}
        <MedicationList user={user} />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        name,
        ${MedicationList.getFragment('user')},
      }
    `,
  },
});
