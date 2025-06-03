import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Spinner, Card } from 'react-bootstrap';
import NavBar from './navbar/navbar';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const email = Cookies.get('email'); // Get email from cookies

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        setError('Email not found in cookies.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:4000/userdata?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        setUserData(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading user profile...</span>
      </div>
    );
  }

  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!userData) return <p>No user data found.</p>;

  return (
    <>
    <NavBar/>
    <Card className="mx-auto mt-4 shadow-sm" style={{ maxWidth: '400px' }}>
      <Card.Body>
        <Card.Title>User Profile</Card.Title>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Location:</strong> {userData.location}</p>
        <p><strong>Gender:</strong> {userData.gender}</p>
        <p><strong>User Type:</strong> {userData.type}</p>
      </Card.Body>
    </Card>
    </>
  );
};

export default UserProfile;
