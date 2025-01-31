import '../../styles/doctor.css';
import { useState } from "react";
import { Card, Button, Form, Container } from "react-bootstrap";
import {Hospital,MapPin,TicketPlus,NotepadTextDashed} from "lucide-react";
import NavBar from "../navbar/navbar";
import placeholder from '../../media/placeholder.jpg';

const DoctorAppointment = () => {
  const [appointmentDate, setAppointmentDate] = useState("");
  
  const [timeSlot, setTimeSlot] = useState("");

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  const handleBooking = () => {
    if (appointmentDate) {
      alert(`Appointment booked on ${appointmentDate}`);
    } else {
      alert("Please select a date for the appointment.");
    }
  };

  return (
    <>
        <NavBar/>
        <div className="appoint-head">
            <h2>Book Your Appointment <NotepadTextDashed/></h2>
        </div>
        <Container className="d-flex justify-content-center appoint-card">
            <Card style={{ width: "22rem" }} className="shadow-lg p-3 mb-5 bg-white rounded">
                <Card.Img
                variant="top"
                src={placeholder}
                alt="Doctor"
                className="rounded-circle mx-auto mt-3"
                style={{ width: "100px", height: "100px" }}
                />
                <Card.Body className="text-center">
                <Card.Title>Dr. John Doe</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Cardiologist</Card.Subtitle>
                <br/>
                <Card.Subtitle className="mb-2 text-muted"><Hospital/> Baptist Hospital, Bellary Rd</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted"><MapPin/> Bangalore</Card.Subtitle>
                <Form>
                    <Form.Group className="mb-3">
                    <Form.Label>Select Appointment Date:</Form.Label>
                    <Form.Control
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                            <option value="">Select Time Slot</option>
                            {timeSlots.map((slot, index) => (
                            <option key={index} value={slot}>{slot}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
                <h5 className="mt-3">Fee: <span className="text-primary">₹100</span></h5>
                <Button variant="warning" className="mt-3 w-100" onClick={handleBooking}>
                    Book Appointment <TicketPlus/>
                </Button>
                </Card.Body>
            </Card>
        </Container>
    </>
    
  );
};

export default DoctorAppointment;
