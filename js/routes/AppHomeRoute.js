import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    user: () => Relay.QL`
      query {
        user (email: "test@gmail.com")
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
