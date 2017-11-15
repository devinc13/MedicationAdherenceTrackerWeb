import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Graph from './Graph';
import Header from './Header';
import Panel from 'react-bootstrap/lib/Panel';

// Styles for this component
const SpacingDiv = styled.div`
  margin: 40px;
`;

class GraphWrapper extends React.Component {
  render() {
    let user = this.props.user;

    return (
      <div>
        <Header user={user} />

        <SpacingDiv>
          <Panel header={'Weekly Adherence:'} bsStyle="primary">
            <Graph user={user}/>
          </Panel>
        </SpacingDiv>
      </div>
    );
  }
}

export default Relay.createContainer(GraphWrapper, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${Graph.getFragment('user')},
        ${Header.getFragment('user')},
      }
    `,
  },
});
