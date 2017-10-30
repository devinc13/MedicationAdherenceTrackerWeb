import Relay from 'react-relay/classic';

export default class AddDosageMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{addDosage}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddDosagePayload @relay(pattern: true) {
        medication {
          dosages {
            edges
          }
        },
        dosageEdge
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'medication',
      parentID: this.props.medicationId,
      connectionName: 'dosages',
      edgeName: 'dosageEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }

  getVariables() {
    return {
      medicationId: this.props.medicationId,
      dosageAmount: this.props.dosageAmount,
      windowStartTime: this.props.windowStartTime,
      windowEndTime: this.props.windowEndTime,
      notificationTime: this.props.notificationTime,
      route: this.props.route,
    };
  }
}

