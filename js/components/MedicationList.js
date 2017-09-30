import React from 'react';
import Relay from 'react-relay';

class MedicationList extends React.Component {
 render() {
    return (
      <div>
        <h1>Medication list</h1>
        <ul>
          {this.props.user.medications.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (Start: {edge.node.start}) (End: {edge.node.end}) (Repeating: {edge.node.repeating}) (Notes: {edge.node.notes})</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(MedicationList, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        medications(first: 10) {
          edges {
            node {
              id,
              name,
              start,
              end,
              repeating,
              notes,
            },
          },
        },
      }
    `,
  },
});
