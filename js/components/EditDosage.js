import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button,
  Modal,
  Panel
  } from 'react-bootstrap/lib/';

 import AddDosageMutation from '../mutations/AddDosageMutation';
 import EditDosageMutation from '../mutations/EditDosageMutation';
 import DeleteDosageMutation from '../mutations/DeleteDosageMutation';
import Header from './Header';

// Styles for this component
const SpacingDiv = styled.div`
  margin: 40px;
`;

class EditDosage extends React.Component {
  constructor() {
    super();
    this.state = {
      id: "",
      dosageAmount: "",
      windowStartTime: "",
      windowEndTime: "",
      notificationTime: "",
      route: "",
      medicationId: "",
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
    const { medication, dosage } = this.props;

    let mutation;

    if (!dosage) {
      this.setState({ errorMessage: "Error adding dosage. Please check your input." });
      mutation = new AddDosageMutation(this.state);
    } else {
      this.setState({ errorMessage: "Error editing dosage. Please check your input." });
      mutation = new EditDosageMutation(this.state);
    }
    
    const onSuccess = (response) => {
      window.location.href = "#/medication/" + medication.id;
    };

    const onFailure = (transaction) => {
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

  deleteDosage() {
    const { user, medication, dosage } = this.props;

    const onSuccess = (response) => {
      window.location.href = "#/medication/" + medication.id;
    };

    const onFailure = (transaction) => {
      this.setState({ errorMessage: "Error deleting dosage." });
      this.open();
    };

    let mutation = new DeleteDosageMutation({ user, medication, dosage });

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
    let newState = {};
    newState["medicationId"] = medication.id;

    let dosage = this.props.dosage;
    if (dosage) {
      newState["id"] = dosage.id;
      newState["dosageAmount"] = dosage.dosageAmount;
      newState["windowStartTime"] = dosage.windowStartTime;
      newState["windowEndTime"] = dosage.windowEndTime;
      newState["notificationTime"] = dosage.notificationTime;
      newState["route"] = dosage.route;
      newState["showDelete"] = true;
    }

    this.setState(newState);
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
          <Panel header="Dosage" bsStyle="primary">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <this.FieldGroup
                id="formControlsDosageAmout"
                type="text"
                label="Dosage Amount"
                placeholder="Enter dosage amount (eg. 1 200mg pill)"
                value={this.state.dosageAmount}
                onChange={this.handleChange.bind(this, 'dosageAmount')}
              />
              <this.FieldGroup
                id="formControlsWindowStartTime"
                type="text"
                label="Dosage window start time"
                placeholder="This is the earliest the dose can be taken (eg. 09:00:00)"
                value={this.state.windowStartTime}
                onChange={this.handleChange.bind(this, 'windowStartTime')}
              />
              <this.FieldGroup
                id="formControlsWindowEndTime"
                type="text"
                label="Dosage window end time"
                placeholder="This is the latest the dose can be taken (eg. 13:00:00)"
                value={this.state.windowEndTime}
                onChange={this.handleChange.bind(this, 'windowEndTime')}
              />
              <this.FieldGroup
                id="formControlsNotificationTime"
                type="text"
                label="Notification time"
                placeholder="(eg. 13:00:00)"
                value={this.state.notificationTime}
                onChange={this.handleChange.bind(this, 'notificationTime')}
              />
              <this.FieldGroup
                id="formControlsRoute"
                type="text"
                label="Route"
                placeholder="(eg. Oral)"
                value={this.state.route}
                onChange={this.handleChange.bind(this, 'route')}
              />
              <Button type="submit" bsStyle="primary" bsSize="large">
                Submit
              </Button>
            </form>
            <br />
            { this.state.showDelete ? <Button bsStyle="danger" onClick={this.deleteDosage.bind(this)}>Delete Dosage</Button> : null }
          </Panel>
        </SpacingDiv>
      </div>
    );
  }
}

export default Relay.createContainer(EditDosage, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        ${Header.getFragment('user')},
        ${DeleteDosageMutation.getFragment('user')},
        medications(first: 10) {
          edges {
            node {
              id,
              name,
              start,
              end,
              repeating,
              notes,
            },
          },
        },
      }
    `,
    medication: () => Relay.QL`
      fragment on Medication {
        ${DeleteDosageMutation.getFragment('medication')},
        id,
        name,
        start,
        end,
        repeating,
        notes,
      }
    `,
    dosage: () => Relay.QL`
      fragment on Dosage {
        ${DeleteDosageMutation.getFragment('dosage')},
        id,
        dosageAmount,
        windowStartTime,
        windowEndTime,
        notificationTime,
        route,
      }
    `,
  },
});
