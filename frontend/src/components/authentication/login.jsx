import '../../styles/auth.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import {useState} from 'react';
import logo from '../../media/main.png'
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
        await axios.post("http://127.0.0.1:4000/login",formData)
            .then((response)=>{
 
                //adding cookies
                Cookies.set('email',response.data.email,{ expires: 2 })
                Cookies.set('name',response.data.name, { expires: 2 })
                Cookies.set('type',response.data.type, { expires: 2 })
                Cookies.set('id',response.data.id, { expires: 2 })
                //redirecting
                if(Cookies.get('type')==='patient'){
                    window.location.href = '/dashboard'
                }
                else{
                    window.location.href = '/ddashboard' //for doctors
                }
                
            })
            .catch((error)=>{
                console.log(error)
                setErr("Incorrect Email/Password");
            })

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
                <a href="/forgotpassword" className="links">forgot password?</a><br/>
                <a href="/signup" className="links">new here?Sign up</a><br/>
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