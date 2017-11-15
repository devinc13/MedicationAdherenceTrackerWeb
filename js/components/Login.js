import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button
  } from 'react-bootstrap/lib/';

import LoginMutation from '../mutations/LoginMutation';
import SignedOutHeader from './SignedOutHeader';
import Panel from 'react-bootstrap/lib/Panel';

// Styles for this component
const SpacingDiv = styled.div`
  padding: 50px 25%;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 20px;
`;

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // Validate form
    let password = this.state.password;

    const onSuccess = (response) => {
      let token = response.login.token;
      if (!token) {
        window.alert("No user found with that email and password.");
      } else {
        console.log("SUCCESS! Token = " + token);
        localStorage.setItem('adherence_tracker_jwt_token', token);
        window.location.href = "/";
      }
    };

    const onFailure = (transaction) => {
      window.alert("Error logging in, please try again later.");
      console.log(transaction.getError().message);
    };

    this.props.relay.commitUpdate(
      new LoginMutation(this.state), {onFailure, onSuccess}
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
        <SignedOutHeader></SignedOutHeader>

        <ButtonWrapper>
          <Link to="/signup"><Button>Don't have an account? Sign up here!</Button></Link>
        </ButtonWrapper>

        <SpacingDiv>
          <Panel header="Login" bsStyle="primary">
          
            <form onSubmit={this.handleSubmit.bind(this)}>
              <this.FieldGroup
                id="formControlsEmail"
                type="email"
                label="Email Address"
                placeholder=""
                value={this.state.email}
                onChange={this.handleChange.bind(this, 'email')}
              />
              <this.FieldGroup
                id="formControlsPassword"
                type="password"
                label="Password"
                placeholder=""
                value={this.state.password}
                onChange={this.handleChange.bind(this, 'password')}
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

export default Relay.createContainer(Login, {
  fragments: {
  },
});
