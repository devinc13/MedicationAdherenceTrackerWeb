import React from 'react';
import Relay from 'react-relay/classic';

import MedicationList from './MedicationList';
import Graph from './Graph';
import Header from './Header';

import Panel from 'react-bootstrap/lib/Panel';
import styled from 'styled-components';

// Styles for this component
const SpacedDiv = styled.div`
  margin: 2%;
  display: inline-block;
  width: 46%;
  vertical-align: top;
  height: 100%;
`;

const HeightDiv = styled.div`
  height: 500px;
`;

class App extends React.Component {
  render() {
    var user = this.props.user;
    return (
      <div>
        <Header user={user} />

        <SpacedDiv>
          <Panel header={'Adherence:'} bsStyle="primary">
            <HeightDiv>
              <Graph user={user} />
            </HeightDiv>
          </Panel>
        </SpacedDiv>

        <SpacedDiv>
          <Panel header={'Medications:'} bsStyle="primary">
            <HeightDiv>
              <MedicationList user={user} />
            </HeightDiv>
          </Panel>
        </SpacedDiv>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        first_name,
        last_name,
        ${MedicationList.getFragment('user')},
        ${Graph.getFragment('user')},
        ${Header.getFragment('user')},
      }
    `,
  },
});
