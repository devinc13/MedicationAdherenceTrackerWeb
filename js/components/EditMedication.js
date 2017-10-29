import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button
  } from 'react-bootstrap/lib/';

import AddMedicationMutation from '../mutations/AddMedicationMutation';
import EditMedicationMutation from '../mutations/EditMedicationMutation';
import DeleteMedicationMutation from '../mutations/DeleteMedicationMutation';

var dateFormat = require('dateformat');

// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

const SpacingDiv = styled.div`
  margin: 20px;
`;

class EditMedication extends React.Component {
  constructor() {
    super();
    this.state = {
      id: "",
      userId: "",
      name: "",
      start: "",
      end: "",
      repeating: "",
      notes: "",
      showDelete: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { user, medication } = this.props;

    this.state.userId = user.id;
    let mutation;
    let failureMessage = "";

    if (!medication) {
      failureMessage = "Error adding medication";
      mutation = new AddMedicationMutation(this.state);
    } else {
      failureMessage = "Error editing medication"
      mutation = new EditMedicationMutation(this.state);
    }
    
    const onSuccess = (response) => {
      window.location.href = "/";
    };

    const onFailure = (transaction) => {
      console.log(transaction.getError().source);
      window.alert(failureMessage);
    };

    this.props.relay.commitUpdate(
      mutation, {onFailure, onSuccess}
    );
  }

  handleChange(name, e) {
    let change = {};
    change[name] = e.target.value;
    this.setState(change);
  }

  deleteMedication() {
    const { user, medication } = this.props;

    const onSuccess = (response) => {
      window.location.href = "/";
    };

    const onFailure = (transaction) => {
      console.log(transaction.getError().source);
      window.alert("Error deleting medication");
    };

    let mutation = new DeleteMedicationMutation({ user, medication });

    this.props.relay.commitUpdate(
      mutation, {onFailure, onSuccess}
    );
  };

  FieldGroup({ id, label, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  }

  componentDidMount() {
    let medication = this.props.medication;
    if (medication) {
      let start = new Date(Date.parse(medication.start));
      let end = new Date(Date.parse(medication.end));

      let newState = {};
      newState["id"] = medication.id;
      newState["name"] = medication.name;
      newState["start"] = dateFormat(start, "yyyy-m-d hh:MM:ss");
      newState["end"] = dateFormat(end, "yyyy-m-d hh:MM:ss");
      newState["repeating"] = medication.repeating;
      newState["notes"] = medication.notes;
      newState["showDelete"] = true;
      this.setState(newState);
    }
  }

  render() {
    return (
      <div>
        <Header>
        <h1>Medication Adherence Tracker</h1>
        </Header>
        <SpacingDiv>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <this.FieldGroup
              id="formControlsName"
              type="text"
              label="Name"
              placeholder="Enter medication name"
              value={this.state.name}
              onChange={this.handleChange.bind(this, 'name')}
            />
            <this.FieldGroup
              id="formControlsStart"
              type="text"
              label="Start"
              placeholder="Enter medication start time and date (eg. 2017-10-16 07:00:00)"
              value={this.state.start}
              onChange={this.handleChange.bind(this, 'start')}
            />
            <this.FieldGroup
              id="formControlsEnd"
              type="text"
              label="End"
              placeholder="Enter medication end time and date (eg. 2017-10-16 07:00:00)"
              value={this.state.end}
              onChange={this.handleChange.bind(this, 'end')}
            />
            <this.FieldGroup
              id="formControlsRepeating"
              type="text"
              label="Repeating"
              placeholder="Select repeating pattern"
              value={this.state.repeating}
              onChange={this.handleChange.bind(this, 'repeating')}
            />
            <this.FieldGroup
              id="formControlsNotes"
              type="text"
              label="Notes"
              placeholder="Enter any additional notes"
              value={this.state.notes}
              onChange={this.handleChange.bind(this, 'notes')}
            />
            <Button type="submit">
              Submit
            </Button>
          </form>
          <br />
          { this.state.showDelete ? <Button bsStyle="danger" onClick={this.deleteMedication.bind(this)}>Delete Medication</Button> : null }
        </SpacingDiv>

      </div>
    );
  }
}

export default Relay.createContainer(EditMedication, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        ${DeleteMedicationMutation.getFragment('user')},
        medications(first: 20) {
          edges {
            node {
              id,
              name,
              start,
              end,
              repeating,
              notes,
              ${DeleteMedicationMutation.getFragment('medication')}
            },
          },
        },
      }
    `,
    medication: () => Relay.QL`
      fragment on Medication {
        id,
        name,
        start,
        end,
        repeating,
        notes,
        ${DeleteMedicationMutation.getFragment('medication')}
      }
    `,
  },
});
