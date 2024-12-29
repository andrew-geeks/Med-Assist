import '../styles/auth.css';
import {useState} from 'react';
import logo from '../media/main.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

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

    const submit = async (e)=>{
        e.preventDefault()
        const response = await fetch("http://127.0.0.1:4000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            setErr("Incorrect Email or Password!")
        }
        else{
            window.location.href = '/dashboard'
            console.log("go to dashboard")
        }
    }

    return(
        <div className="auth-group">
            {/* <img src={logo} width="40" height="40" alt=""/> */}
            <Form>
                <img src={logo} width="40" height="40" alt=""/>
                <h3>Login</h3>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Enter Email address</Form.Label>
                    <Form.Control  type="email" name="email"  onChange={handleChange} placeholder="Your E-mail" required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Enter Password</Form.Label>
                    <Form.Control  type="password" name="password" onChange={handleChange} placeholder="Your password" required/>
                </Form.Group>
                <Button variant="success" onClick={submit}>Login</Button>
                {
                err && (
                    <div>
                        <br/>
                        <Alert variant="danger" onClose={() => setErr("")} dismissible>
                        {err}
                        </Alert>
                    </div>
                   
                )
            }
            </Form>
            
        </div>
    )
}

export default Login;