import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import axios from "axios";
import NavBar from "../components/navbar/navbar";
import '../styles/xray.css';
export default function Xray() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage("");
    } else {
      setMessage("Only PNG and JPG files are allowed.");
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a valid PNG or JPG image.");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:4000/predxray", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.predicted_class);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <>
        <NavBar/>
        <h2 className="heading">Analyze Chest X-Ray</h2>
        <Card className="p-4 w-50 mx-auto mt-5 text-center b1">
      <Card.Body>
        <Form>
          <Form.Group controlId="formFile">
            <Form.Label>Select x-ray Image(only png & jpg files)</Form.Label>
            <Form.Control type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
          </Form.Group>
        </Form>
        {preview && <img src={preview} alt="Preview" width="200" height="300" className="mt-4 w-100 rounded" />}
        <Button className="mt-4"  onClick={handleUpload} disabled={!selectedFile}>
          Analyze Image
        </Button>
      </Card.Body>
    </Card>
    <h4 className="message">{message && <p className="text-danger mt-2">{"Detected Issue: "+message}</p>}</h4>
    </>
    
  );
}
