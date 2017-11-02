import Relay from 'react-relay/classic';

export default class EditDosageMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{editDosage}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EditDosagePayload @relay(pattern: true) {
        user {
          medications {
            edges
          }
        },
        dosage
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        dosage: this.props.id
      },
    }];
  }

  getVariables() {
    return {
      id: this.props.id,
      dosageAmount: this.props.dosageAmount,
      windowStartTime: this.props.windowStartTime,
      windowEndTime: this.props.windowEndTime,
      notificationTime: this.props.notificationTime,
      route: this.props.route,
    };
  }
}
