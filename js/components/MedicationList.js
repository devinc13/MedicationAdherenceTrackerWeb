import React from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/Button';
import Link from 'react-router/lib/Link';


// Styles for this component
const MedicationsDiv = styled.div`
  height: 450px;
`;

const buttonStyle = { margin: '0 auto 10px' };

class MedicationList extends React.Component {

  render() {
    return (
    	<div>
	      <MedicationsDiv>
          {this.props.user.medications.edges.map(edge =>
            <div key={edge.node.id}>
              <Link key={edge.node.id} to={`/medication/${edge.node.id}`}>
                <Button block style={buttonStyle}>{edge.node.name}</Button>
              </Link>
            </div>
          )}
		    </MedicationsDiv>

		  <Button href="#/editMedication/null" bsStyle="primary" bsSize="large" block>Add new medication</Button>  
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
