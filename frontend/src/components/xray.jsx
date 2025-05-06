import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import NavBar from "../components/navbar/navbar";
import '../styles/xray.css';

export default function Xray() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [doctors, setDoctors] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage("");
      setError("");
      setDoctors([]); // clear previous doctors
    } else {
      setError("Only PNG and JPG files are allowed.");
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a valid PNG or JPG image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setError("");
      setMessage("Analyzing...");
      const response = await axios.post("http://127.0.0.1:4000/predxray", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const predictedClass = response.data.predicted_class;
      setMessage(predictedClass);

      const userType = Cookies.get("type");
      const userLocation = Cookies.get("location");

      if (userType === "patient" && userLocation) {
        const doctorResponse = await axios.get(`http://127.0.0.1:4000/fetchdoctors?location=${userLocation}`);
        
        setDoctors(doctorResponse.data || []);
      }

    } catch (error) {
      console.error(error);
      setError("Upload a valid chest x-ray image.");
      setMessage("");
    }
  };

  return (
    <>
      <NavBar />
      <h2 className="heading">Analyze Chest X-Ray</h2>
      <Card className="p-4 w-50 mx-auto mt-5 text-center b1">
        <Card.Body>
          <Form>
            <Form.Group controlId="formFile">
              <Form.Label>Select X-Ray Image (only PNG & JPG files)</Form.Label>
              <Form.Control type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
            </Form.Group>
          </Form>
          {preview && (
            <img src={preview} alt="Preview" width="200" height="300" className="mt-4 w-100 rounded" />
          )}
          <Button className="mt-4" onClick={handleUpload} disabled={!selectedFile}>
            Analyze Image
          </Button>
        </Card.Body>
      </Card>

      {error && <h4 className="message text-danger mt-2">{error}</h4>}

      {message && (
        <h4 className="message text-danger mt-3">Detected Issue: {message}</h4>
      )}

      {doctors.length > 0 && (
        <div className="w-50 mx-auto mt-4">
          <h5>Recommended Doctors Near You:</h5>
          <ul className="list-group">
            {doctors.map((doctor, idx) => (
              <li key={idx} className="list-group-item">
                <strong>👤 Dr. {doctor.doctorName}</strong><br />
                <strong>Specialization:</strong> {doctor.specialization}<br />
                <strong>Location:</strong> {doctor.hospitalName}, {doctor.hospitalPlace}<br />
                <Button variant="primary" className="mt-2" onClick={() => window.location.href = `/appointment/${doctor.d_id}`}>
                  Book Appointment
                </Button><br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
