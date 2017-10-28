import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';

// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

class Medication extends React.Component {
  render() {
    var medication = this.props.user.medications.edges.find(edge => edge.node.id == this.props.id).node;
    return (
      <div>
        <Header>
        <h1>Medication Adherence Tracker</h1>
        {medication.name}
        <br />
        Start: {medication.start}
        <br />
        End: {medication.end}
        <br />
        Repeats: {medication.repeating}
        <br />
        Notes: {medication.notes}
        </Header>
      </div>
    );
  }
}

export default Relay.createContainer(Medication, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        medications(first: 20) {
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
