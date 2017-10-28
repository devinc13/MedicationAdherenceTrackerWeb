import Relay from 'react-relay/classic';

export default class AddMedicationMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{addMedication}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddMedicationPayload @relay(pattern: true) {
        user {
          medications {
            edges
          }
        },
        medicationEdge
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.userId,
      connectionName: 'medications',
      edgeName: 'medicationEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }

  getVariables() {
    return {
      userId: this.props.userId,
      name: this.props.name,
      start: this.props.start,
      end: this.props.end,
      repeating: this.props.repeating,
      notes: this.props.notes,
    };
  }
}
