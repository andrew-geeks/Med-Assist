import {useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../styles/auth.css';
import logo from '../../media/main.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


function DSignup(){
    const [formData,setFormData] = useState({});
    const [err,setErr] = useState("");


    const handleChange=(e)=>{
        const {name,value}= e.target;
        setFormData((prevData)=>({
            ...prevData,
            [name]:value,
        }));
    }



    //submit method
    const submit= async (e)=>{
        e.preventDefault();
        //password comparison
        if(formData["password"]!==formData["cpassword"]){
            setErr("Password is not matching!");
        }
        //password length check
        else if(formData["password"].length<6){
            setErr("Password should have minimum 6 characters");
        }
        //gender check
        else if(formData["gender"]===""){
            setErr("Select Gender");
        }
        //gender check
        else if(formData["location"]===""){
            setErr("Select Location");
        }
        //specialization check
        else if(formData["specialization"]===""){
            setErr("Select Specialization");
        }
        //submission
        else{
            formData.cpassword=""
            formData.type="doctor"
            await axios.post("http://127.0.0.1:4000/signup",formData)
            .then((response)=>{
                //success -- all cookies are set for 2 days
                //console.log(response.data)
                Cookies.set('email',response.data.email,{ expires: 2 })
                Cookies.set('name',response.data.name, { expires: 2 })
                Cookies.set('type',response.data.type, { expires: 2 })
                Cookies.set('id',response.data.id, { expires: 2 })
                //redirecting
                window.location.href = '/editprofile'
            },(error)=>{
                console.log(error.response.data.message)
                setErr(error.response.data.message)
            })

        }
        
        


    };

    return(
        <div className="auth-group">
        <Form onSubmit={submit}>
            <img src={logo} width="40" height="40" alt=""/>
            <h3>SignUp <span className="doctor-auth-logo">Doctor🩺</span></h3>
            <Row>
                <Col>
                <Form.Label>Enter Full Name</Form.Label>
                <Form.Control placeholder="Your name" name="name" onChange={handleChange} value={formData.name} required/>
                </Col>
                <Col>
                <Form.Label>Enter Email address</Form.Label>
                <Form.Control type="email" placeholder="Your e-mail" name="email"  onChange={handleChange} value={formData.email} required/>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                <Form.Select aria-label="Default select example" name="gender"  onChange={handleChange} value={formData.gender}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="nothing">Prefer Not to say</option>
                </Form.Select>
                </Col>
                <Col>
                <Form.Select aria-label="Default select example" name="location"  onChange={handleChange} value={formData.location}>
                    <option value="">Select Location</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                </Form.Select>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                <Form.Select aria-label="Default select example" name="specialization"  onChange={handleChange} value={formData.specialization}>
                    <option value="">Select Specialization</option>
                    <option value="Pulmonologist">Pulmonologist</option>
                    <option value="Thoraic Surgeon">Thoraic Surgeon</option>
                    <option value="General">General</option>
                    <option value="Cardiologist">Cardiologist </option>
                    <option value="Oncologist">Oncologist  </option>
                </Form.Select>
                </Col>
            </Row>
            <br/>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Enter Password</Form.Label>
                <Form.Control  type="password" placeholder="Your password" name="password"  onChange={handleChange} value={formData.password} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Re-enter Password</Form.Label>
                <Form.Control  type="password" placeholder="Your password" name="cpassword"  onChange={handleChange} value={formData.cpassword} required/>
            </Form.Group>
            <Button variant="warning" type="submit" >SignUp</Button>
            
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

export default DSignup;