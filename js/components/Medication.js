import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';

// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

const MedicationDiv = styled.div`
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
        </Header>
        <MedicationDiv>
          {medication.name}
          <br />
          Start: {medication.start}
          <br />
          End: {medication.end}
          <br />
          Repeats: {medication.repeating}
          <br />
          Notes: {medication.notes}
          <br />
          <Link to={`/editMedication/${medication.id}`}>Edit Medication</Link>
        </MedicationDiv>
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
