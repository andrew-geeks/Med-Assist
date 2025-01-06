import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import Chat from './chat';
import NavBar from './navbar';
import '../styles/xray.css';

function Xray(){
    return(
        <div>
            <NavBar/>
            <div className="d1">
                <h3>Load your chest🫁 x-ray here..</h3>
                <br/>
                <Form.Group controlId="formFile" className="mb-3 file">
                    <Form.Label>Upload image in .jpg format</Form.Label>
                    <Form.Control type="file" accept="image/jpeg"/>
                    <br/>
                    <Button variant="warning">Analyse🔎</Button>
                 </Form.Group>
            </div>
            <br/><br/>
            <h4>Queries regarding interpretation?</h4>
            {/* <form>
            <Button variant="primary" onSubmit={window.location.href = '/chat'}>Use MedBot</Button>
            </form> */}
            
        </div>
    )
}


export default Xray;