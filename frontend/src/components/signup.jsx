import '../styles/auth.css';
import logo from '../media/main.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


function Signup(){
    return(
        <div className="auth-group">
        <Form>
            <img src={logo} width="40" height="40" alt=""/>
            <h3>SignUp↗️</h3>
            <Row>
                <Col>
                <Form.Label>Enter Full Name</Form.Label>
                <Form.Control placeholder="Your name" />
                </Col>
                <Col>
                <Form.Label>Enter Email address</Form.Label>
                <Form.Control type="email" placeholder="Your e-mail" />
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                <Form.Select aria-label="Default select example">
                    <option>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nothing">Prefer Not to say</option>
                </Form.Select>
                </Col>
                <Col>
                <Form.Select aria-label="Default select example">
                    <option>Select Location</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                </Form.Select>
                </Col>
            </Row>
            <br/>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Enter Password</Form.Label>
                <Form.Control  type="password" placeholder="Your password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Re-enter Password</Form.Label>
                <Form.Control  type="password" placeholder="Your password" />
            </Form.Group>
            <Button variant="warning">SignUp</Button>
        </Form>
    </div>
    )
}

export default Signup;