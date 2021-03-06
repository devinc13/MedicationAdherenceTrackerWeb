import React from 'react';
import Relay from 'react-relay/classic';

import styled from 'styled-components';
import {Button} from 'react-bootstrap/lib/';
import Link from 'react-router/lib/Link';

const StyledHeader = styled.div`
  padding: 15px;
  background: #dddddd;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
`;

const NameWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
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
        <ButtonWrapper>
          <Button onClick={this.logout}>Logout</Button>
        </ButtonWrapper>
        <NameWrapper>
          Welcome {this.props.user.first_name} {this.props.user.last_name}
        </NameWrapper>
        
        <Link to="/"><Title>Medication Adherence Tracker</Title></Link>
        
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
