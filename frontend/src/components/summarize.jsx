import React,{useState} from 'react';
import Navbar from './navbar';
import '../styles/summarize.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import pdfToText from 'react-pdftotext';


  



function Summarize(){
    const [text, setText] = useState(""); //stores report text
    const [summ,setSum] = useState(""); //stores summary
   
    function extractText(event) {
        const file = event.target.files[0]
        pdfToText(file)
            .then(text => setText(text))
            .catch(error => console.error("Failed to extract text from pdf"))
    }

    const getSummary=async ()=>{
        console.log("summary invoked")
        const data = {
            "model": "llama3.2",
            "prompt": text+". summarize the report in 70 words",
            "stream": false
          }

          await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then((response) => { 
            return response.json().then((data) => {
                console.log(data.response);
                setSum(data.response)
                return data.response;
            }).catch((err) => {
                console.log(err);
            }) 

        });
    }



    return(
        <div>
            <Navbar/>
            <div className="c1">
                <h3>Upload any medical reports here to summarize..</h3>
                <Form.Group controlId="formFile" className="mb-3 file" onSubmit={getSummary}>
                    <Form.Label>Upload report in .pdf format</Form.Label>
                    <Form.Control type="file" accept="application/pdf" onChange={extractText} required/>
                    <br/>
                    <Button variant="warning" onClick={getSummary}>Summarize📄</Button>
                 </Form.Group>
                 <br/>
                 <br/>
            </div>
            <br/>
            <div className="c2">
                <h4>Report Summary</h4>
                <p>{summ}</p>
            </div>
            
        </div>
    )
}

export default Summarize;