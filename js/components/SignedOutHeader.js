import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import Link from 'react-router/lib/Link';

const StyledHeader = styled.div`
  padding: 15px;
  background: #dddddd;
`;

const Title = styled.div`
  font-size: 36px;
  padding: 15px;
  font-family: "Arial Black", Gadget, sans-serif
`;

class Header extends React.Component {
  logout() {
    localStorage.removeItem('adherence_tracker_jwt_token');
    window.location.href = "/";
  }

  render() {
    return (
      <StyledHeader>
        <Link to="/"><Title>Medication Adherence Tracker</Title></Link>
      </StyledHeader>
    );
  }
}

export default Relay.createContainer(Header, {
  fragments: {
  },
});
