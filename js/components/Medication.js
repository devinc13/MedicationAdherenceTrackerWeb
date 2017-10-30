import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';
import Button from 'react-bootstrap/lib/Button';

// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

const MedicationDiv = styled.div`
  text-align: center;
  margin: 10px;
`;

const DosageDiv = styled.div`
  text-align: center;
  margin: 10px;
`;

class Medication extends React.Component {
  render() {
    var medication = this.props.user.medications.edges.find(edge => edge.node.id == this.props.id).node;
    console.log(medication);
    return (
      <div>
        <Header>
          <h1>Medication Adherence Tracker</h1>
        </Header>
        <MedicationDiv>
          <h3>{medication.name}</h3>
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
        <DosageDiv>
          <h3>Dosages</h3>
          {medication.dosages.edges.map(edge =>
            <div key={edge.node.id}>
              <Link to={`/medication/${medication.id}/editDosage/${edge.node.id}`}>{edge.node.dosageAmount} Notificaion Time = {edge.node.notificationTime}</Link>
              <br />
            </div>
          )}
          <Link to={`/medication/${medication.id}/editDosage/null`}>
            <Button bsStyle="primary" bsSize="large" block>Add new dosage</Button>
          </Link>
        </DosageDiv>
      </div>
    );
  }
}

export default Relay.createContainer(Medication, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        medications(first: 20) {
          edges {
            node {
              id,
              name,
              start,
              end,
              repeating,
              notes,
              dosages(first: 20) {
                edges {
                  node {
                    id,
                    dosageAmount,
                    windowStartTime,
                    windowEndTime,
                    notificationTime,
                    route,
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
