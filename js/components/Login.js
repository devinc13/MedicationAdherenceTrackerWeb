import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';

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
        </Header>
      </div>
    );
  }
}

export default Relay.createContainer(Login, {
  fragments: {
  },
});
