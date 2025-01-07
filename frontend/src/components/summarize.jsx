import React,{useState} from 'react';
import Navbar from './navbar';
import '../styles/summarize.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as pdfjsLib from "pdfjs-dist";

// import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


  



function Summarize(){
    const [pdfText, setPdfText] = useState("");

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
        const fileReader = new FileReader();
    
        fileReader.onload = async (e) => {
            const typedArray = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
    
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            text += pageText + "\n";
            }
    
            setPdfText(text);
        };
        fileReader.readAsArrayBuffer(file);
        } 
        else {
            alert("Please upload a valid PDF file.");
        }
    };





    return(
        <div>
            <Navbar/>
            <div className="c1">
                <h3>Upload any medical reports here to summarize..</h3>
                <Form.Group controlId="formFile" className="mb-3 file">
                    <Form.Label>Upload image in .pdf format</Form.Label>
                    <Form.Control type="file" onChange={handleFileUpload} accept="application/pdf"/>
                    <br/>
                    <Button variant="warning">Summarize📄</Button>
                 </Form.Group>
                 <br/>
                 <br/>
                 <p>{pdfText}</p>
            </div>
        </div>
    )
}

export default Summarize;