import Relay from 'react-relay/classic';

export default {
  user: () => Relay.QL`
      query {
        user (email: "test@gmail.com")
      }
    `,
};
