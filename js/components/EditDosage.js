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

 import AddDosageMutation from '../mutations/AddDosageMutation';

// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

const SpacingDiv = styled.div`
  margin: 20px;
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
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { medication, dosage } = this.props;

    let mutation;
    let failureMessage = "";

    if (!dosage) {
      failureMessage = "Error adding dosage";
      mutation = new AddDosageMutation(this.state);
    } else {
      failureMessage = "Error editing dosage"
      //mutation = new EditDosageMutation(this.state);
    }
    
    const onSuccess = (response) => {
      window.location.href = "#/medication/" + medication.id;
    };

    const onFailure = (transaction) => {
      console.log(transaction.getError().source);
      window.alert(failureMessage);
    };

    console.log(this.state);

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
    return;
    // const { user, medication } = this.props;

    // const onSuccess = (response) => {
    //   window.location.href = "/";
    // };

    // const onFailure = (transaction) => {
    //   console.log(transaction.getError().source);
    //   window.alert("Error deleting medication");
    // };

    // let mutation = new DeleteMedicationMutation({ user, medication });

    // this.props.relay.commitUpdate(
    //   mutation, {onFailure, onSuccess}
    // );
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
    console.log(this.props);
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
    return (
      <div>
        <Header>
        <h1>Medication Adherence Tracker</h1>
        </Header>
        <SpacingDiv>
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
            <Button type="submit">
              Submit
            </Button>
          </form>
          <br />
          { this.state.showDelete ? <Button bsStyle="danger" onClick={this.deleteDosage.bind(this)}>Delete Dosage</Button> : null }
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
        medications(first: 20) {
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
