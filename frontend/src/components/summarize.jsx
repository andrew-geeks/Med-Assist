import React, { useState } from 'react';
import Navbar from './navbar/navbar';
import '../styles/summarize.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Commet } from "react-loading-indicators";
import axios from 'axios';

function Summarize() {
  const [summ, setSum] = useState(""); // stores summary
  const [progress, setProgress] = useState("none");
  const [disSumm, setDisSumm] = useState("none");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [backendMessage, setBackendMessage] = useState(''); // <- NEW

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setBackendMessage('');
    setSum('');
    setDisSumm('none');
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadStatus('');
    } else {
      setUploadStatus('Please select a valid PDF file.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSum('');
    setDisSumm('none');
    setProgress('');
    setBackendMessage('');
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

      if (response.data.response) {
        setSum(response.data.response);
        setDisSumm('');
        setProgress('none');
      } else if (response.data.message) {
        setBackendMessage(response.data.message);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      const msg = error.response?.data?.message || 'Failed to upload file.';
      setBackendMessage(msg);
    } finally {
      setProgress('none');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="c1">
        <h3>Upload any medical reports here to summarize..</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3 file">
            <Form.Label>Upload report in .pdf format</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              className="custom-file-upload"
              onChange={handleFileChange}
              required
            />
            <br />
            <Button variant="warning" type="submit">Summarize📄</Button>
            <p style={{ color: 'red' }}>{uploadStatus}</p>
          </Form.Group>
        </Form>
        <Commet color="#1a1fdc" size="medium" style={{ display: progress }} text="Summarizing" textColor="#160fdc" />
        {backendMessage && (
          <div style={{ marginTop: '10px', color: backendMessage.includes("upload") ? 'red' : 'green' }}>
            <strong>{backendMessage}</strong>
          </div>
        )}
        <br />
        <br />
      </div>

      <div className="c2">
        <h4>Report Summary</h4><br />
        <div style={{ display: disSumm }} className="summary-block">
          <p style={{ whiteSpace: "pre-line" }}>{summ}</p>
        </div>
      </div>
    </div>
  );
}

export default Summarize;
