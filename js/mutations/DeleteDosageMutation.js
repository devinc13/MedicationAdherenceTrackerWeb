import Relay from 'react-relay/classic';

export default class DeleteDosageMutation extends Relay.Mutation {

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
    dosage: () => Relay.QL`
      fragment on Dosage {
        id
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{deleteDosage}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteDosagePayload @relay(pattern: true) {
        user {
          medications {
            edges {
              node {
                dosages
              }
            }
          }
        },
        medication { dosages },
        deletedId
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'medication',
      parentID: this.props.medication.id,
      connectionName: 'dosages',
      deletedIDFieldName: 'deletedId',
    }];
  }

  getVariables() {
    return {
      id: this.props.dosage.id,
      medicationid: this.props.medication.id,
    };
  }
}
