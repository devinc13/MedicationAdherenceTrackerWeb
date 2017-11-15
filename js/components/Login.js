import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Panel,
  Modal
  } from 'react-bootstrap/lib/';

import LoginMutation from '../mutations/LoginMutation';
import SignedOutHeader from './SignedOutHeader';

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
    // Validate form
    let password = this.state.password;

    const onSuccess = (response) => {
      let token = response.login.token;
      if (!token) {
        this.setState({ errorMessage: "No user found with that email and password." });
        this.open();
      } else {
        localStorage.setItem('adherence_tracker_jwt_token', token);
        window.location.href = "/";
      }
    };

    const onFailure = (transaction) => {
      this.setState({ errorMessage: "Error logging in, please try again later." });
      this.open();
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
