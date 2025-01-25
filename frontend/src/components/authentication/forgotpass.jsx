import React,{useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import logo from '../../media/main.png';
import axios from 'axios';
import '../../styles/auth.css';

function ForgotPass(){
    const [formData,setFormData] = useState({});
    const [err,setErr] = useState("");
    const [variant,setVariant] = useState("danger");

    const handleChange=(e)=>{
        const {name,value}= e.target;
        setFormData((prevData)=>({
            ...prevData,
            [name]:value,
        }));
    }

    const submit =async (e)=>{
        e.preventDefault()
        await axios.post("http://127.0.0.1:4000/forgotpassword",formData)
        .then((response)=>{
            console.log(response)
            setVariant("success");
            setErr("Reset Password Link sent in Mail!");
        })
        .catch((error)=>{
            console.log(error)
            setVariant("danger")
            setErr("Incorrect Email");
        })

    }

    return(
        <div className='auth-group'>
            <Form>
            <img src={logo} width="40" height="40" alt=""/>
            <h3>Forgot Password</h3>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Enter Email address</Form.Label>
                <Form.Control  type="email" name="email"  onChange={handleChange} placeholder="Your E-mail" required/>
            </Form.Group>
            <Button variant="warning" onClick={submit}>Send Mail</Button>
                {
                err && (
                    <div>
                        <br/>
                        <Alert variant={variant} onClose={() => setErr("")} dismissible>
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