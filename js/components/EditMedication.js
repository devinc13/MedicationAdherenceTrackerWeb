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


// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

// Styles for this component
const SpacingDiv = styled.div`
  margin: 20px;
`;

class EditMedication extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: "",
      name: "",
      start: "",
      end: "",
      repeats: "",
      notes: "",
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    this.state.userId = this.props.user.id;

    const onSuccess = (response) => {
      window.location.href = "/";
    };

    const onFailure = (transaction) => {
      console.log(transaction.getError());
      window.alert("Error adding medication.");
    };

    const mutation = new AddMedicationMutation(this.state);

    this.props.relay.commitUpdate(
      mutation, {onFailure, onSuccess}
    );
  }

  handleChange(name, e) {
    let change = {};
    change[name] = e.target.value;
    this.setState(change);
  }


  FieldGroup({ id, label, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
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
              id="formControlsText"
              type="text"
              label="Name"
              placeholder="Enter medication name"
              value={this.state.name}
              onChange={this.handleChange.bind(this, 'name')}
            />
            <this.FieldGroup
              id="formControlsText"
              type="text"
              label="Start"
              placeholder="Enter medication start time and date (eg. 2017-10-16 07:00:00)"
              value={this.state.start}
              onChange={this.handleChange.bind(this, 'start')}
            />
            <this.FieldGroup
              id="formControlsText"
              type="text"
              label="End"
              placeholder="Enter medication end time and date (eg. 2017-10-16 07:00:00)"
              value={this.state.end}
              onChange={this.handleChange.bind(this, 'end')}
            />
            <this.FieldGroup
              id="formControlsText"
              type="text"
              label="Repeating"
              placeholder="Select repeating pattern"
              value={this.state.repeating}
              onChange={this.handleChange.bind(this, 'repeating')}
            />
            <this.FieldGroup
              id="formControlsText"
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
  },
});
