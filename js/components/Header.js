import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';

const StyledHeader = styled.div`
  text-align: center;
  margin: 10px;
`;

class Header extends React.Component {
 render() {
    return (
      <StyledHeader>
        <Link to="/"><h1>Medication Adherence Tracker</h1></Link>
        Welcome {this.props.user.first_name} {this.props.user.last_name}
        <br />
        <Link to="/login">Sign out</Link>

      </StyledHeader>
    );
  }
}

export default Relay.createContainer(Header, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        first_name,
        last_name,
      }
    `,
  },
});
