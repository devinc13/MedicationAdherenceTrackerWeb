import React from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import Button from 'react-bootstrap/lib/Button';

// Styles for this component
const MedicationsDiv = styled.div`
  height: 450px;
`;

class MedicationList extends React.Component {
 render() {
    return (
    	<div>
	      <MedicationsDiv>
	        <ul>
	          {this.props.user.medications.edges.map(edge =>
	            <li key={edge.node.id}>{edge.node.name} (Start: {edge.node.start}) (End: {edge.node.end}) (Repeating: {edge.node.repeating}) (Notes: {edge.node.notes})</li>
	          )}
	        </ul>
		  </MedicationsDiv>

		  <Button bsStyle="primary" bsSize="large" block>Add new medication</Button>  
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
