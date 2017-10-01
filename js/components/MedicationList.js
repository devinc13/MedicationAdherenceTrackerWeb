import React from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import Button from 'react-bootstrap/lib/Button';

import * as Styled from './componentStyles/MedicationListStyles';

const bottomButtonStyle = {};

class MedicationList extends React.Component {
 render() {
    return (
    	<div>
	      <Styled.MedicationsDiv>
	        <ul>
	          {this.props.user.medications.edges.map(edge =>
	            <li key={edge.node.id}>{edge.node.name} (Start: {edge.node.start}) (End: {edge.node.end}) (Repeating: {edge.node.repeating}) (Notes: {edge.node.notes})</li>
	          )}
	        </ul>
		  </Styled.MedicationsDiv>

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
