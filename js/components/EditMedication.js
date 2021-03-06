import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Modal,
  Panel
  } from 'react-bootstrap/lib/';

import AddMedicationMutation from '../mutations/AddMedicationMutation';
import EditMedicationMutation from '../mutations/EditMedicationMutation';
import DeleteMedicationMutation from '../mutations/DeleteMedicationMutation';
import Header from './Header';

var dateFormat = require('dateformat');

// Styles for this component
const SpacingDiv = styled.div`
  margin: 40px;
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
      repeating: "daily",
      notes: "",
      showDelete: false,
      showError: false,
      errorMessage: "",
    };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { user, medication } = this.props;

    this.state.userId = user.id;
    let mutation;
    let successLocation = "";

    if (!medication) {
      this.setState({ errorMessage: "Error adding medication. Please check your input." });
      mutation = new AddMedicationMutation(this.state);
      successLocation = "/";
    } else {
      this.setState({ errorMessage: "Error editing medication. Please check your input." });
      mutation = new EditMedicationMutation(this.state);
      successLocation = "#/medication/" + medication.id;
    }
    
    const onSuccess = (response) => {
      window.location.href = successLocation;
    };

    const onFailure = (transaction) => {
      // Show error message
      this.open();
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
      this.setState({ errorMessage: "Error deleting medication." });
      this.open();
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
      newState["start"] = dateFormat(start, "yyyy-m-d HH:MM:ss");
      newState["end"] = dateFormat(end, "yyyy-m-d HH:MM:ss");
      newState["repeating"] = medication.repeating;
      newState["notes"] = medication.notes;
      newState["showDelete"] = true;
      this.setState(newState);
    }
  }

  render() {
    var user = this.props.user;
    return (
      <div>
        <Header user={user} />

        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{this.state.errorMessage}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>

        <SpacingDiv>
          <Panel header="Medication" bsStyle="primary">
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
              <FormGroup controlId="formControlsRepeating">
                <ControlLabel>Repeating</ControlLabel>
                <FormControl componentClass="select" value={this.state.repeating} placeholder="" onChange={this.handleChange.bind(this, 'repeating')}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </FormControl>
              </FormGroup>
              <this.FieldGroup
                id="formControlsNotes"
                type="text"
                label="Notes"
                placeholder="Enter any additional notes"
                value={this.state.notes}
                onChange={this.handleChange.bind(this, 'notes')}
              />
              <Button type="submit" bsStyle="primary" bsSize="large">
                Submit
              </Button>
            </form>
            <br />
            { this.state.showDelete ? <Button bsStyle="danger" onClick={this.deleteMedication.bind(this)}>Delete Medication</Button> : null }
          </Panel>
        </SpacingDiv>

      </div>
    );
  }
}

export default Relay.createContainer(EditMedication, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ${Header.getFragment('user')},
        id,
        ${DeleteMedicationMutation.getFragment('user')},
        medications(first: 10) {
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



