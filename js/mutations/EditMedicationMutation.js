import Relay from 'react-relay/classic';

export default class EditMedicationMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{editMedication}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EditMedicationPayload @relay(pattern: true) {
        user {
          medications {
            edges
          }
        },
        medication
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        medication: this.props.id
      },
    }];
  }

  getVariables() {
    return {
      id: this.props.id,
      name: this.props.name,
      start: this.props.start,
      end: this.props.end,
      repeating: this.props.repeating,
      notes: this.props.notes,
    };
  }
}
