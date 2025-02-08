import React, { useEffect, useState } from "react";
import { Table, Button, Container, Spinner, Alert } from "react-bootstrap";
import Cookies from 'js-cookie';
import Navbar from "../navbar/navbar.jsx";
import axios from 'axios';

const YourAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:4000/fetchappointments", {
                params: { id: Cookies.get("id") }
            });
            const updatedArray = response.data.map((item, index) => ({
                id: index + 1, 
                ...item, 
            }));
            //console.log(updatedArray)
            setAppointments(updatedArray);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch appointments.");
            setLoading(false);
        }
    };

    fetchAppointments();
    // fetch("http://127.0.0.1:4000/fetchappointments?id="+Cookies.get("id"))
    //   .then((response) => {
    //     console.log("response: "+response)
    //     const updatedArray = response.map((item, index) => ({
    //         id: index + 1, // Assigning ID starting from 1
    //         ...item,       // Keeping existing properties
    //     }));
    //     setAppointments(updatedArray);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     setError("Failed to fetch appointments.");
    //     setLoading(false);
    //   });
  }, []);

  const handleUpdate = (id) => {
    alert(`Update appointment with ID: ${id}`);
  };

  const handleCancel = (id) => {
    alert(`Cancel appointment with ID: ${id}`);
  };

  const handleComplete = (id) => {
    alert(`Complete appointment with ID: ${id}`);
  };

  return (
    <>
        <Navbar/>
        <Container className="mt-4">
        <h2>Patient Appointments</h2>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
            <Table striped bordered hover responsive>
            <thead>
                <tr>
                <th>Id</th>
                <th>Appointment Date</th>
                <th>Time Slot</th>
                <th>Patient Mail</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {appointments.length > 0 ? (
                appointments.map((appointment) => (
                    <tr key={appointment.id}>
                    <td>{appointment.appointment_date}</td>
                    <td>{appointment.time_slot}</td>
                    <td>{appointment.patient_mail}</td>
                    <td>
                        <Button variant="warning" size="sm" onClick={() => handleUpdate(appointment.id)}>
                        Update
                        </Button>{" "}
                        <Button variant="danger" size="sm" onClick={() => handleCancel(appointment.id)}>
                        Cancel
                        </Button>{" "}
                        <Button variant="success" size="sm" onClick={() => handleComplete(appointment.id)}>
                        Complete
                        </Button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="4" className="text-center">
                    No appointments found.
                    </td>
                </tr>
                )}
            </tbody>
            </Table>
        )}
        </Container>
    </>
  );
};

export default YourAppointment;
