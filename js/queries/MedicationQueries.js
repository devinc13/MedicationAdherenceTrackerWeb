import Relay from 'react-relay/classic';

export default {
  medication: () => Relay.QL`
      query {
        medication (id: $id)
      }
    `,
};
