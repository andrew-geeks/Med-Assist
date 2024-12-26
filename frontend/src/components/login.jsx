import '../styles/auth.css';
import logo from '../media/main.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Login(){
    return(
        <div className="auth-group">
            {/* <img src={logo} width="40" height="40" alt=""/> */}
            <Form>
                <img src={logo} width="40" height="40" alt=""/>
                <h3>Login</h3>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Enter Email address</Form.Label>
                    <Form.Control  type="email"  placeholder="Your E-mail" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Enter Password</Form.Label>
                    <Form.Control  type="password" placeholder="Your password" />
                </Form.Group>
                <Button variant="success">Login</Button>
            </Form>
        </div>
    )
}

export default Login;