import React,{useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import logo from '../../media/main.png';

function ForgotPass(){
    const [formData,setFormData] = useState({});
    const [err,setErr] = useState("");

    const handleChange=(e)=>{
        const {name,value}= e.target;
        setFormData((prevData)=>({
            ...prevData,
            [name]:value,
        }));
    }

    return(
        <div>
            <img src={logo} width="40" height="40" alt=""/>
            <h3>Forgot Password</h3>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Enter Email address</Form.Label>
                <Form.Control  type="email" name="email"  onChange={handleChange} placeholder="Your E-mail" required/>
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

export default ForgotPass;