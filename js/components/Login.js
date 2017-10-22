import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';

//import LoginMutation from '../mutations/LoginMutation'

// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

class Login extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     email: "",
  //     password: ""
  //   };
  // }

  // login = function(email, password) {
  //   const environment = this.props.relay.environment
  //   LoginMutation.commit({
  //     environment,
  //     input: { email, password },
  //     onCompleted: () => {
  //       // TODO: Redirect
  //     },
  //     onError: (errors) => {
  //       // TODO: Show this somewhere
  //       console.error('login failed', errors[0])
  //     },
  //   })
  // }

  render() {
    return (
      <div>
        <Header>
        <h1>Medication Adherence Tracker</h1>
        Login
        </Header>


      </div>
    );
  }
}

export default Relay.createContainer(Login, {
  fragments: {
  },
});