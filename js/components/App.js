import React from 'react';
import Relay from 'react-relay';

import MedicationList from './MedicationList';
import Panel from 'react-bootstrap/lib/Panel';
import styled from 'styled-components';

const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

const SpacedDiv = styled.div`
  margin: 10px;
  display: inline-block;
  width: 45%;
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
        <Header>
        <h1>Medication Adherence Tracker</h1>
        Welcome {this.props.user.name}
        </Header>

        <SpacedDiv>
          <Panel header={'Adherence:'} bsStyle="primary">
            <HeightDiv>
              TODO
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
        name,
        ${MedicationList.getFragment('user')},
      }
    `,
  },
});
