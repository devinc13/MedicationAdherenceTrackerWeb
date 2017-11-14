import Relay from 'react-relay/classic';

export default class AddUserMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{addUser}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddUserPayload @relay(pattern: true) {
        userId,
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: null,
      connectionName: null,
      edgeName: null,
      rangeBehaviors: {
        '': 'ignore',
      },
    }];
  }

  getVariables() {
    return {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.email,
      password: this.props.password,
    };
  }
}
