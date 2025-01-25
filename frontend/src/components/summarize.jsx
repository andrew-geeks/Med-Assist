import React,{useState} from 'react';
import Navbar from './navbar/navbar';
import '../styles/summarize.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//import pdfToText from 'react-pdftotext';
import { Commet } from "react-loading-indicators";
import axios from 'axios';



function Summarize(){
    // const [text, setText] = useState(""); //stores report text
    const [summ,setSum] = useState(""); //stores summary
    const [progress,setProgress] = useState("none");
    const [disSumm,setDisSumm] = useState("none");
    
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
          setFile(selectedFile);
          setUploadStatus('');
        } else {
          setUploadStatus('Please select a valid PDF file.');
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("file submission invoked")
        setSum("")
        setDisSumm("none")
        setProgress("")
        if (!file) {
          setUploadStatus('Please select a file first.');
          return;
        }
    
        const formData = new FormData();
        formData.append('pdf', file);
    
        try {
          const response = await axios.post('http://127.0.0.1:4000/summarize', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response.data.response)
          setDisSumm("")
          setProgress("none")
          setSum(response.data.response)
          //setUploadStatus(`Upload successful: ${response.data.message}`);
        } catch (error) {
          console.error('Error uploading file:', error);
          setUploadStatus('Failed to upload file.');
        }
    };

    // function extractText(event) {
    //     const file = event.target.files[0]
    //     pdfToText(file)
    //         .then(text => setText(text))
    //         .catch(error => console.error("Failed to extract text from pdf"))
    // }

    // const getSummary=async ()=>{
    //     console.log("summary invoked")
    //     const data = {
    //         "model": "llama3.2",
    //         "prompt": text+". summarize the above report in 100 words.",
    //         "stream": false
    //       }

          
    //       setProgress("")
    //       setDisSumm("none")
    //       await fetch("http://localhost:11434/api/generate", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //       }).then((response) => { 
    //         return response.json().then((data) => {
    //             console.log(data.response);
    //             var summary = data.response.split('**').join("\n");
    //             setSum(summary)
    //             setProgress("none");
    //             setDisSumm("");
    //             return data.response;
    //         }).catch((err) => {
    //             console.log(err);
    //         }) 

    //     });
    // }



    return(
        <div>
            <Navbar/>
            <div className="c1">
                <h3>Upload any medical reports here to summarize..</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFile" className="mb-3 file">
                        <Form.Label>Upload report in .pdf format</Form.Label>
                        <Form.Control type="file" accept="application/pdf" className="custom-file-upload " onChange={handleFileChange} required/>
                        <br/>
                        <Button variant="warning" type="submit">Summarize📄</Button>
                        <p>{uploadStatus}</p>
                    </Form.Group>
                </Form> 
                <Commet color="#1a1fdc" size="medium"  style={{"display":progress}} text="Summarizing" textColor="#160fdc" />
                {/* <CircularProgress color="#3171cc" style={{"display":progress}} size="small" text="Summarizing..." textColspoor="" /> */}
                 <br/>
                 <br/>
            </div>
            <br/>
            <div className="c2">
                <h4>Report Summary</h4><br/>
                <div style={{"display":disSumm}} className="summary-block">
                    <p style={{"white-space": "pre-line"}}>{summ}</p>
                </div>
                
            </div>
            
        </div>
    )
}

export default Summarize;