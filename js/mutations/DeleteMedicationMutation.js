import Relay from 'react-relay/classic';

export default class DeleteMedicationMutation extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
    medication: () => Relay.QL`
      fragment on Medication {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{deleteMedication}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteMedicationPayload @relay(pattern: true) {
        user { medications },
        deletedId
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'Medication',
      deletedIDFieldName: 'deletedId',
    }];
  }

  getVariables() {
    return {
      id: this.props.medication.id,
    };
  }
}
