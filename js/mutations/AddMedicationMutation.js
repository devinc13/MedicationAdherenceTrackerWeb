import Relay from 'react-relay/classic';

export default class AddMedicationMutation extends Relay.Mutation {
// static fragments = {
//     story: () => Relay.QL`
//       fragment on Story {
//         id,
//       }
//     `,
//   };





  getMutation() {
    return Relay.QL`mutation{addMedication}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddMedicationPayload @relay(pattern: true) {
        user {
          medications,
        },
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
        'status(any)': 'append',
        'status(active)': 'append',
        'status(completed)': null,
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
