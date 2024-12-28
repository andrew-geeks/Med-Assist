import '../styles/auth.css';
import {useState} from 'react';
import logo from '../media/main.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Login(){
    const [formData,setFormData] = useState({});
    const [err,setErr] = useState("");

    const handleChange=(e)=>{
        const {name,value}= e.target;
        setFormData((prevData)=>({
            ...prevData,
            [name]:value,
        }));
    }

    const submit = (e)=>{
        e.preventDefault()
        console.log(formData)
    }

    return(
        <div className="auth-group">
            {/* <img src={logo} width="40" height="40" alt=""/> */}
            <Form onSubmit={submit}>
                <img src={logo} width="40" height="40" alt=""/>
                <h3>Login</h3>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Enter Email address</Form.Label>
                    <Form.Control  type="email" name="email"  onChange={handleChange} placeholder="Your E-mail" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Enter Password</Form.Label>
                    <Form.Control  type="password" name="password" onChange={handleChange} placeholder="Your password" />
                </Form.Group>
                <Button variant="success">Login</Button>
            </Form>
        </div>
    )
}

export default Login;