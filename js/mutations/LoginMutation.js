import Relay from 'react-relay/classic';

export default class LoginMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{login}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LoginPayload @relay(pattern: true) {
        token
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL`
        fragment on LoginPayload {
          token
        }`]
    }];
  }

  getVariables() {
    return {
      email: this.props.email,
      password: this.props.password,
    };
  }
}
