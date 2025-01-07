import '../styles/navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import navlogo from '../media/main.png'




function NavBar(){
    return(
        <div className=''>
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container className=''>
          <Navbar.Brand href="#home">
            <img alt="" src={navlogo} width="40" height="40" className="d-inline-block align-top"/>{' '}
            <span className="brandname">MedAssist</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="container-fluid">
              <Nav.Item className='ms-auto'>
                <Nav.Link href="/xray">Analyze X-Ray</Nav.Link>
              </Nav.Item>
              <Nav.Link href="/summarize">Summarize Reports</Nav.Link>

              <NavDropdown title="More" id="basic-nav-dropdown">
                <NavDropdown.Item href="/login">LogIn</NavDropdown.Item>
                <NavDropdown.Item href="/signup">SignUp</NavDropdown.Item>
                <NavDropdown.Item href="#doctors">For Doctors</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  About
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </div>
    )
}


export default NavBar;