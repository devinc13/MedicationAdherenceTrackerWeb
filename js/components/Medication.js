import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';
import Button from 'react-bootstrap/lib/Button';
import Header from './Header';
import Panel from 'react-bootstrap/lib/Panel';

// Styles for this component
const SpacedDiv = styled.div`
  margin: 2%;
  display: inline-block;
  width: 46%;
  vertical-align: top;
  height: 100%;
`;

const buttonStyles = { margin: '0 auto 10px' };

class Medication extends React.Component {
  render() {
    var user = this.props.user;
    var medication = this.props.user.medications.edges.find(edge => edge.node.id == this.props.id).node;
    return (
      <div>
        <Header user={user} />

        <SpacedDiv>
          <Panel header={medication.name} bsStyle="primary">
            <b>Start:</b> {medication.start}
            <br />
            <b>End:</b> {medication.end}
            <br />
            <b>Repeats:</b> {medication.repeating}
            <br />
            <b>Notes:</b> {medication.notes}
            <br />
            <br />
            <Link to={`/editMedication/${medication.id}`}>
              <Button bsStyle="primary">Edit Medication</Button>
            </Link>
          </Panel>
        </SpacedDiv>

        <SpacedDiv>
          <Panel header="Dosages" bsStyle="primary">
            {medication.dosages.edges.map(edge =>
              <div key={edge.node.id}>
                <Link to={`/medication/${medication.id}/editDosage/${edge.node.id}`}>
                  <Button block style={buttonStyles}>
                    {edge.node.dosageAmount} Notification Time = {edge.node.notificationTime}
                  </Button>
                </Link>
              </div>
            )}
            <br />
            <Link to={`/medication/${medication.id}/editDosage/null`}>
              <Button bsStyle="primary">Add new dosage</Button>
            </Link>
          </Panel>
        </SpacedDiv>
      </div>
    );
  }
}

export default Relay.createContainer(Medication, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${Header.getFragment('user')},
        id,
        medications(first: 10) {
          edges {
            node {
              id,
              name,
              start,
              end,
              repeating,
              notes,
              dosages(first: 10) {
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
