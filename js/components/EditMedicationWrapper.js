import React from 'react';
import Relay from 'react-relay/classic';

import EditMedication from './EditMedication';



class EditMedicationWrapper extends React.Component {
  render() {
    let user = this.props.user;
    let medicationEdge = this.props.user.medications.edges.find(edge => edge.node.id == this.props.id);
    let medication = null;
    if (medicationEdge) {
      medication = medicationEdge.node;
    }

    return <EditMedication user={user} medication={medication} />
  }
}

export default Relay.createContainer(EditMedicationWrapper, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        ${EditMedication.getFragment('user')}
        medications(first: 10) {
          edges {
            node {
              id,
              name,
              start,
              end,
              repeating,
              notes,
              ${EditMedication.getFragment('medication')}
            },
          },
        },
      }
    `,
  },
});
