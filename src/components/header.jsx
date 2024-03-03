import React from 'react';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Logo from '../image/logo.png';

function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    navigate('/login');
    // Implement your logout logic here
    console.log('User logged out');
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand onClick={()=>{navigate('/')}} style={{cursor: 'pointer'}}>
        <Image
            src={Logo} // Adjust the path according to your project structure
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
            alt="Logo"
          />
          Stock Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Add other navigation links here */}
          </Nav>
          <Button variant="outline-primary" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
