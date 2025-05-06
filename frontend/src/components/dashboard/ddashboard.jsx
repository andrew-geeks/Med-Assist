import NavBar from "../navbar/navbar";
import Cookie from 'js-cookie';
import '../../styles/dashboard.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Table } from "react-bootstrap";

function DocDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [consultationEarnings, setConsultationEarnings] = useState(0);
    const [patientsConsulted, setPatientsConsulted] = useState(0);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:4000/fetchappointments", {
                    params: { id: Cookie.get("id") }
                });

                const allAppointments = response.data;
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth(); // 0-indexed

                let upcoming = [];
                let earnings = 0;
                let pastPatientsCount = 0;

                allAppointments.forEach((appointment) => {
                    const appointmentDate = new Date(appointment.appointment_date);

                    if (appointmentDate >= currentDate) {
                        upcoming.push(appointment);
                    }

                    if (
                        appointmentDate.getFullYear() === currentYear &&
                        appointmentDate.getMonth() === currentMonth &&
                        appointmentDate < currentDate
                    ) {
                        earnings += Number(appointment.fee || 0);
                        pastPatientsCount++;
                    }
                });

                setAppointments(upcoming);
                setUpcomingCount(upcoming.length);
                setConsultationEarnings(earnings);
                setPatientsConsulted(pastPatientsCount);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching doctor appointments:", error);
            }
        };

        fetchAppointments();
    }, []);

    const handleCancel = async (appointmentId) => {
        try {
            await axios.post("http://127.0.0.1:4000/cancelappointment", {
                "_id": appointmentId
            });

            // Remove the canceled appointment from UI
            setAppointments(prev => prev.filter(app => app._id !== appointmentId));
            setUpcomingCount(prev => prev - 1);

            alert("Appointment canceled successfully!");
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            alert("Failed to cancel appointment!");
        }
    };

    return (
        <>
            <NavBar />
            <div>
                <h5 className="head">Welcome Dr. {Cookie.get('name')},</h5>
            </div>

            {/* Stats Section */}
            <div className="info-container">
                <div className="box">
                    <h5>Upcoming Appointments</h5><br/>
                    <h5 className="box-val">{upcomingCount}</h5>
                </div>
                <div className="box">
                    <h5>Consultation Earnings (this month)</h5><br/>
                    <h5 className="box-val">₹{consultationEarnings}</h5>
                </div>
                <div className="box">
                    <h5>Patients Consulted<br/>(this month)</h5><br/>
                    <h5 className="box-val">{patientsConsulted}</h5>
                </div>
            </div>
            <br/><br/>
            {/* Appointment List Section */}
            <Container className="mt-4">
                <h3 className="mb-3">Upcoming Appointments</h3>

                {loading ? (
                    <p>Loading appointments...</p>
                ) : appointments.length === 0 ? (
                    <p>No upcoming appointments.</p>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Patient Email</th>
                                <th>Appointment Date</th>
                                <th>Time Slot</th>
                                <th>Fee</th>
                                <th>Location</th>
                                <th>Manage Appointment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>{appointment.patient_mail || "Unknown"}</td>
                                    <td>{appointment.appointment_date}</td>
                                    <td>{appointment.time_slot}</td>
                                    <td>₹{appointment.fee}</td>
                                    <td>{appointment.location_address}</td>
                                    <td>
                                        <Button variant="warning" size="sm">
                                            Update
                                        </Button> 
                                        <Button variant="danger" size="sm" onClick={() => handleCancel(appointment._id)}>
                                            Cancel
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
}

export default DocDashboard;
