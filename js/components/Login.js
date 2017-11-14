import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';

// Styles for this component
const Header = styled.div`
  text-align: center;
  margin: 10px;
`;

class Login extends React.Component {
  render() {
    return (
      <div>
        <Header>
        <h1>Medication Adherence Tracker</h1>
        Login
        <br />
        <Link to="/signup">Don't have an account? Sign up here!</Link>
        </Header>
      </div>
    );
  }
}

export default Relay.createContainer(Login, {
  fragments: {
  },
});
