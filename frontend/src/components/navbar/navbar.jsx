import '../../styles/navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import navlogo from '../../media/main.png'




function NavBar(){

    const LogOut = () =>{
      Cookies.remove("name");
      Cookies.remove("email");
      Cookies.remove("type");
      window.location.href = '/'
    }

    return(
        <div className=''>
        <Navbar expand="lg" className="bg-body-tertiary navbar">
        <Container className=''>
          <Navbar.Brand href="/">
            <img alt="" src={navlogo} width="40" height="40" className="d-inline-block align-top"/>{' '}
            <span className="brandname">MedAssist</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="container-fluid">
              <Nav.Item className='ms-auto'>
                <Nav.Link href="/xray">Analyze X-Ray</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/summarize">Summarize Reports</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/chat">Chat🗯️</Nav.Link>
              </Nav.Item>
              <NavDropdown title="More" id="basic-nav-dropdown">
                {Cookies.get("email")===null?<NavDropdown.Item href="/login">LogIn</NavDropdown.Item>:null}
                {Cookies.get("email")===null?<NavDropdown.Item href="/signup">SignUp</NavDropdown.Item>:null}
                {Cookies.get("email")?<NavDropdown.Item href="/userprofile">User Profile</NavDropdown.Item>:null}
                {Cookies.get("type")==="patient"?<NavDropdown.Item href="/appointmenthistory">Appointment History</NavDropdown.Item>:null}
                {Cookies.get("email")?<NavDropdown.Item onClick={LogOut}>Logout</NavDropdown.Item>:null}
                
                {Cookies.get("email")===null?<NavDropdown.Item href="/dsignup">For Doctors</NavDropdown.Item>:null}
                {Cookies.get("type")==="doctor"?<NavDropdown.Item href="/editProfile">Edit Profile</NavDropdown.Item>:null}
                
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