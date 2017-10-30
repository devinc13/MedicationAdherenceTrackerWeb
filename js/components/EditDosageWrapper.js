import React from 'react';
import Relay from 'react-relay/classic';

import EditDosage from './EditDosage';



class EditDosageWrapper extends React.Component {
  render() {
    let user = this.props.user;
    // This page should only be accessed after a valid medication has been created
    let medication = this.props.user.medications.edges.find(edge => edge.node.id == this.props.medicationId).node;
    let dosageEdge = medication.dosages.edges.find(edge => edge.node.id == this.props.dosageId);
    let dosage = null;
    if (dosageEdge) {
      dosage = dosageEdge.node;
    }

    return <EditDosage user={user} medication={medication} dosage={dosage} />
  }
}

export default Relay.createContainer(EditDosageWrapper, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        ${EditDosage.getFragment('user')}
        medications(first: 20) {
          edges {
            node {
              id,
              ${EditDosage.getFragment('medication')}
              dosages(first: 20) {
                edges {
                  node {
                    id,
                    dosageAmount,
                    windowStartTime,
                    windowEndTime,
                    notificationTime,
                    route,
                    ${EditDosage.getFragment('dosage')}
                  }
                }
              }
            },
          },
        },
      }
    `,
  },
});
