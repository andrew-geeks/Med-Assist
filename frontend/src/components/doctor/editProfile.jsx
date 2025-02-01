import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {Info,UserRoundPen,Save} from 'lucide-react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    doctorName: "",
    phoneNumber: "",
    location: "",
    hospitalName: "",
    hospitalPlace: "",
    consultationFee: "",
    availableDays: [],
    availableTimeSlots: [],
  });

  const [phoneError, setPhoneError] = useState("");

  // Days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Generate time slots in 12-hour format (9 AM - 10 AM to 8 PM - 9 PM)
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const startHour = 9 + i;
    const endHour = startHour + 1;
    const formatTime = (hour) => `${hour <= 11 ? hour : hour - 12} ${hour < 12 ? "AM" : "PM"}`;
    return `${formatTime(startHour)} - ${formatTime(endHour)}`;
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") {
      // Allow only numeric input and limit to 10 digits
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) {
        setPhoneError("Phone number cannot exceed 10 digits");
        return;
      } else {
        setPhoneError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox selection for available days
  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      availableDays: checked
        ? [...prevState.availableDays, value]
        : prevState.availableDays.filter((day) => day !== value),
    }));
  };

  // Handle checkbox selection for available time slots
  const handleTimeSlotChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      availableTimeSlots: checked
        ? [...prevState.availableTimeSlots, value]
        : prevState.availableTimeSlots.filter((slot) => slot !== value),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    console.log("Updated Profile Data:", formData);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Edit Profile <UserRoundPen size={40}/></h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Doctor Name</Form.Label>
              <Form.Control type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} placeholder="Enter doctor's name" required/>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" maxLength="10" required/>
              {phoneError && <p className="text-danger">{phoneError}</p>}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location" required/>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Hospital Name</Form.Label>
              <Form.Control type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="Enter hospital name" required/>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Hospital Place</Form.Label>
          <Form.Control type="text" name="hospitalPlace" value={formData.hospitalPlace} onChange={handleChange} placeholder="Enter hospital place" required/>
          <br/>
          <em><Info/>The mentioned hospital and its place will be were the doctor is available for consultation.</em>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Consultation Fee (in Rupees)</Form.Label>
          <Form.Control type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} placeholder="Enter fee" required/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Select Available Days</Form.Label>
          <Row>
            {daysOfWeek.map((day) => (
              <Col key={day} xs={6} md={4}>
                <Form.Check
                  type="checkbox"
                  label={day}
                  value={day}
                  checked={formData.availableDays.includes(day)}
                  onChange={handleDayChange}
                />
              </Col>
            ))}
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Available Time Slots</Form.Label>
          <Row>
            {timeSlots.map((slot) => (
              <Col key={slot} xs={6} md={4}>
                <Form.Check
                  type="checkbox"
                  label={slot}
                  value={slot}
                  checked={formData.availableTimeSlots.includes(slot)}
                  onChange={handleTimeSlotChange}
                />
              </Col>
            ))}
          </Row>
        </Form.Group>
        <Button variant="warning" type="submit">Save Details <Save/></Button>
      </Form>
    </Container>
  );
};

export default EditProfile;
