import React from 'react';
import Relay from 'react-relay/classic';

class Graph extends React.Component {
 render() {
    return (
    	<div>
	      <h3> TODO: Add graph here</h3>
		</div>
    );
  }
}

export default Relay.createContainer(Graph, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
      	first_name,
      }
    `,
  },
});
