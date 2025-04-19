import '../../styles/doctor.css';
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Form, Container } from "react-bootstrap";
import {Hospital,MapPin,TicketPlus,NotepadTextDashed} from "lucide-react";
import NavBar from "../navbar/navbar";
import placeholder from '../../media/placeholder.jpg';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import logo from '../../media/main.png';
import Cookies from 'js-cookie';
//USE REACT DATE PICKER FOR SELECTING DATES
import Calendar from 'react-calendar';

const DoctorAppointment = () => {
  const { id } = useParams();
  const [docUser,setDocUser] = useState({
    doctorName: "",
    phoneNumber: "",
    location: "",
    hospitalName: "",
    hospitalPlace: "",
    consultationFee: "",
    availableDays: [],
    availableTimeSlots: [],
  }) //contains availability,timeslots,hospital details
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [err,setErr] = useState("");
  const [value, setValue] = useState(new Date()); //for date picker
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');


  useEffect(()=>{
    const fetchData = async ()=>{
        const response = await axios.get("http://127.0.0.1:4000/docdata",{params:{id:id}}) //fetching doctor-details
        setDocUser(response.data)
        
       
    }  
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }
    // creating order
    const result = await axios.post("http://127.0.0.1:4000/pay",{amount:docUser.consultationFee});

    if (!result) {
        alert("Server error. Are you online?");
        return;
    }

    // Getting the order details back
    const { amount, order_id, currency } = result.data;

    const options = {
        key: "rzp_test_jxOfKQ0JtjKg3V", //rp-key 
        amount: amount.toString(),
        currency: currency,
        name: "MedAssist",
        description: "Consultation Charges",
        image: { logo },
        order_id: order_id,
        handler: async function (response) {
            const data = {
                orderCreationId: order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                booked_email:Cookies.get("email"),
                pay_date: `${year}-${month}-${day}`
            };

            const appoint_data = {
              patient_mail: Cookies.get("email"),
              doc_id: id,
              doctor_name: docUser.doctorName,
              specialization: docUser.specialization,
              doc_pho: docUser.phoneNumber,
              appointment_date: appointmentDate,
              fee: docUser.consultationFee,
              time_slot: timeSlot,
              location_address: docUser.hospitalName+", "+docUser.hospitalPlace,
            }

            await axios.post("http://127.0.0.1:4000/paysuccess", data) //sending payment details for db storage
            //storing appointments
            .then(async res=>{
                await axios.post("http://127.0.0.1:4000/appointment",appoint_data) //sending appointment details
                .then(
                  resp=>{
                    console.log("Payment success...booking confirmed");
                    //redirect
                    window.location.href="/confirm"
                  }
                )
            })
            .catch(err=>{console.log(err)})
            //redirecting to confirmation
            
        },
        prefill: {
            name: "MedAssist",
            email: "medassist.crew@gmail.com",
            contact: "+919935534231",
        },
        notes: {
            address: "MedAssist, Bengaluru",
        },
        theme: {
            color: "#61dafb",
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }





  const handleBooking = async () => {
    if (!appointmentDate) {
      setErr("Select date for Appointment")
      return;
    }
    else if(timeSlot===""){
      setErr("Select timeslot")
      return;
    }
    else{
      //call for payment
      //console.log(appointmentDate)
      displayRazorpay();
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
                <Card.Title>Dr. {docUser.doctorName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{docUser.specialization}</Card.Subtitle>
                <br/>
                <Card.Subtitle className="mb-2 text-muted"><Hospital/> {docUser.hospitalName}, {docUser.hospitalPlace}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted"><MapPin/>{docUser.location}</Card.Subtitle>
                <Form>
                    <Form.Group className="mb-3">
                    <Form.Label>Select Appointment Date:</Form.Label>
                    {/* <Calendar className="react-calendar" value={value}/> */}
                    <Form.Control
                        type="date"
                        min={`${year}-${month}-${day}`} 
                        max="2025-06-01"
                        value={appointmentDate} 
                        onChange={(e) => setAppointmentDate(e.target.value)}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                            <option value="">Select Time Slot</option>
                            {docUser.availableTimeSlots.map((slot, index) => (
                            <option key={index} value={slot} disabled>{slot}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
                <h5 className="mt-3">Fee: <span className="text-primary">₹{docUser.consultationFee}.0</span></h5>
                <Button variant="warning" className="mt-3 w-100" onClick={handleBooking}>
                    Book Appointment <TicketPlus/>
                </Button>
                </Card.Body>
                {
                err && (
                    <div>
                        <br/>
                        <Alert variant="danger" onClose={() => setErr("")} dismissible>
                        {err}
                        </Alert>
                    </div>
                   
                )
            } 
            </Card>
            
        </Container>
    </>
    
  );
};

export default DoctorAppointment;
