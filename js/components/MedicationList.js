import React from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import Button from 'react-bootstrap/lib/Button';
import Link from 'react-router/lib/Link';

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
	            <div key={edge.node.id}>
                <Link to={`/medication/${edge.node.id}`}>{edge.node.name}</Link>
                <br />
              </div>
	          )}
	        </ul>
		  </MedicationsDiv>

		  <Button href="#/addMedication" bsStyle="primary" bsSize="large" block>Add new medication</Button>  
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
