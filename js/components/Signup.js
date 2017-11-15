import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';
import SignedOutHeader from './SignedOutHeader';
import Panel from 'react-bootstrap/lib/Panel';

import AddUserMutation from '../mutations/AddUserMutation';

import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button
  } from 'react-bootstrap/lib/';

// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

const SpacingDiv = styled.div`
  padding: 50px 25%;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 20px;
`;

class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      password2: "",
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // Validate form
    let password = this.state.password;
    let password2 = this.state.password2;
    let passwordLength = password.length;

    if (passwordLength < 8) {
      window.alert("Password must have a length of at least 8 characters");
      return;
    }

    if (password != password2) {
      window.alert("Passwords must match!");
      return;
    }
    
    const onSuccess = (response) => {
      window.location.href = "#/login";
    };

    const onFailure = (transaction) => {
      if (transaction.getError().message.includes("duplicate key value violates unique constraint \"users_email_key\"")) {
        window.alert("That email is already in use, please login to your existing account or use a different email address.");
      } else {
        window.alert("Error creating account, please try again later.");
      }
    };

    this.props.relay.commitUpdate(
      new AddUserMutation(this.state), {onFailure, onSuccess}
    );
  }

  handleChange(name, e) {
    let change = {};
    change[name] = e.target.value;
    this.setState(change);
  }

  FieldGroup({ id, label, getValidationState, ...props }) {
    return (
      <FormGroup controlId={id} validationState={getValidationState()}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  }

  password1ValidationState() {
    let password = this.state.password;
    let length = password.length;

    if (length == 0) {
      return null;
    }

    if (length < 8) {
      return 'error';
    }

    return 'success';
  }

  password2ValidationState() {
    let password = this.state.password;
    let password2 = this.state.password2;
    let length = password2.length;

    if (length == 0) {
      return null;
    }

    if (length < 8) {
      return 'error';
    }

    if (password != password2) {
      return 'error';
    }
    
    return 'success';
  }

  noValidation() {
    return null;
  }

  render() {
    return (
      <div>
        <SignedOutHeader></SignedOutHeader>

        <ButtonWrapper>
          <Link to="/login"><Button>Already have an account? Login here!</Button></Link>
        </ButtonWrapper>

        <SpacingDiv>
          <Panel header="Signup" bsStyle="primary">
            <form onSubmit={this.handleSubmit.bind(this)}>
                <this.FieldGroup
                  id="formControlsFirstName"
                  type="text"
                  label="First Name"
                  placeholder=""
                  getValidationState={this.noValidation.bind(this)}
                  value={this.state.firstName}
                  onChange={this.handleChange.bind(this, 'firstName')}
                />
                <this.FieldGroup
                  id="formControlsLastName"
                  type="text"
                  label="Last Name"
                  placeholder=""
                  getValidationState={this.noValidation.bind(this)}
                  value={this.state.lastName}
                  onChange={this.handleChange.bind(this, 'lastName')}
                />
                <this.FieldGroup
                  id="formControlsEmail"
                  type="email"
                  label="Email Address"
                  placeholder=""
                  getValidationState={this.noValidation.bind(this)}
                  value={this.state.email}
                  onChange={this.handleChange.bind(this, 'email')}
                />
                <this.FieldGroup
                  id="formControlsPassword"
                  type="password"
                  label="Password"
                  placeholder="Minimum 8 characters"
                  getValidationState={this.password1ValidationState.bind(this)}
                  value={this.state.password}
                  onChange={this.handleChange.bind(this, 'password')}
                />
                <this.FieldGroup
                  id="formControlsPassword2"
                  type="password"
                  label="Retype Password"
                  placeholder="Must match above password"
                  getValidationState={this.password2ValidationState.bind(this)}
                  value={this.state.password2}
                  onChange={this.handleChange.bind(this, 'password2')}
                />
                <Button type="submit">
                  Submit
                </Button>
              </form>
            </Panel>
          </SpacingDiv>
      </div>
    );
  }
}

export default Relay.createContainer(Signup, {
  fragments: {
  },
});
