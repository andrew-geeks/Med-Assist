import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import Navbar from '../navbar/navbar.jsx';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const email = Cookies.get('email');

      if (!email) {
        setError('User email not found in cookies.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:4000/getappointments', {
          params: { email },
        });

        const today = new Date().toISOString().split('T')[0];
        console.log(response);
        // Ensure consistent comparison format: "YYYY-MM-DD"
        const pastAppointments = response.data.filter(
          app => app.appointment_date && app.appointment_date < today
        );

        setAppointments(pastAppointments);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load appointment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
    <Navbar />
    <Container className="mt-4">
      <h3 className="mb-3">Appointment History</h3>
      <p>Your past appointments</p>
      {loading && <Spinner animation="border" variant="primary" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && appointments.length === 0 && (
        <Alert variant="info">No past appointments found.</Alert>
      )}

      {!loading && !error && appointments.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Appointment Date</th>
              <th>Time Slot</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app, index) => (
              <tr key={index}>
                <td>{app.doctor_name}</td>
                <td>{app.specialization}</td>
                <td>{app.appointment_date}</td>
                <td>{app.time_slot}</td>
                <td>{app.location_address}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
    </>
  );
};

export default AppointmentHistory;
