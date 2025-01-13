import React,{useState} from 'react';
import Navbar from './navbar/navbar';
import '../styles/summarize.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import pdfToText from 'react-pdftotext';
import { Commet } from "react-loading-indicators";




function Summarize(){
    const [text, setText] = useState(""); //stores report text
    const [summ,setSum] = useState(""); //stores summary
    const [progress,setProgress] = useState("none");
    //const [wc,setWc] = useState(70);
    
    // const handleCount = (e)=>{
    //     setWc(e.target.value)
    //     console.log(wc)
    // }

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
            "prompt": text+". summarize the report in a concise way.",
            "stream": false
          }

          
          setProgress("")
          await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then((response) => { 
            return response.json().then((data) => {
                console.log(data.response);
                var summary = data.response.split('**').join("\n");
                setSum(summary)
                setProgress("none");
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
                <Form>
                    <Form.Group controlId="formFile" className="mb-3 file" onSubmit={getSummary}>
                        <Form.Label>Upload report in .pdf format</Form.Label>
                        <Form.Control type="file" accept="application/pdf" className="custom-file-upload " onChange={extractText} required/>
                        <br/>
                        {/* <Form.Label>Select Word Count</Form.Label>
                        <br/>
                        <Form.Check inline label="70 words" value="70" name="group1" type="radio" onChange={handleCount}/>
                        <Form.Check inline label="100 words" value="100" name="group1" type="radio" onChange={handleCount}/>
                        <Form.Check inline label="150 words" value="150" name="group1" type="radio" onChange={handleCount}/>
                        <br/> */}
                        <Button variant="warning" onClick={getSummary}>Summarize📄</Button>
                        
                    </Form.Group>
                </Form> 
                <Commet color="#1a1fdc" size="medium"  style={{"display":progress}} text="Summarizing" textColor="#160fdc" />
                {/* <CircularProgress color="#3171cc" style={{"display":progress}} size="small" text="Summarizing..." textColspoor="" /> */}
                 <br/>
                 <br/>
            </div>
            <br/>
            <div className="c2">
                <h4>Report Summary</h4>
                <p style={{"white-space": "pre-line"}}>{summ}</p>
            </div>
            
        </div>
    )
}

export default Summarize;