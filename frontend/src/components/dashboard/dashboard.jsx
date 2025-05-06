import NavBar from "../navbar/navbar";
import Cookies from 'js-cookie';
import '../../styles/dashboard.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';

function Dashboard() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:4000/getappointments", {
                    params: { email: Cookies.get("email") }
                });

                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

                const filteredAppointments = response.data
                    .filter(item => {
                        const appointmentDate = new Date(item.appointment_date);
                        appointmentDate.setHours(0, 0, 0, 0); // Reset time part
                        return appointmentDate >= today;
                    })
                    .map((item, index) => ({
                        id: index + 1,
                        ...item,
                    }));

                setAppointments(filteredAppointments);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div>
            <NavBar />
            <h3 className="head">Welcome {Cookies.get('name')},</h3>
            <br />
            <Container className="mt-4">
                <h2 className="mb-3">Your Appointments</h2>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Date</th>
                            <th>Time Slot</th>
                            <th>Doctor Name</th>
                            <th>Doctor Phone</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={appointment.id}>
                                <td>{index + 1}</td>
                                <td>{appointment.appointment_date}</td>
                                <td>{appointment.time_slot}</td>
                                <td>{appointment.doctor_name}</td>
                                <td>{appointment.doc_pho}</td>
                                <td>{appointment.location_address}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default Dashboard;
