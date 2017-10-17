import React from 'react';
import Relay from 'react-relay';

import MedicationList from './MedicationList';
import Graph from './Graph';
import Panel from 'react-bootstrap/lib/Panel';
import * as Styled from './componentStyles/AppStyles';


class App extends React.Component {
  render() {
    var user = this.props.user;
    return (
      <div>
        <Styled.Header>
        <h1>Medication Adherence Tracker</h1>
        Welcome {this.props.user.first_name} {this.props.user.last_name}
        </Styled.Header>

        <Styled.SpacedDiv>
          <Panel header={'Adherence:'} bsStyle="primary">
            <Styled.HeightDiv>
              <Graph user={user} />
            </Styled.HeightDiv>
          </Panel>
        </Styled.SpacedDiv>

        <Styled.SpacedDiv>
          <Panel header={'Medications:'} bsStyle="primary">
            <Styled.HeightDiv>
              <MedicationList user={user} />
            </Styled.HeightDiv>
          </Panel>
        </Styled.SpacedDiv>
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
      }
    `,
  },
});
