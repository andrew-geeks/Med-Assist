import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Spinner, Card, Button, Alert } from 'react-bootstrap';
import NavBar from './navbar/navbar';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');

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

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:4000/deleteaccount', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete account');
      }

      // Clear email cookie and show message
      Cookies.remove('email');
      Cookies.remove('name');
      Cookies.remove('type');
      Cookies.remove('id');
      Cookies.remove('location');
      window.location.href = '/'; // Redirect to login page after deletion
      setDeleteMsg('Account deleted successfully.');
      setUserData(null); // Optional: clear user data
    } catch (err) {
      setError(err.message || 'Something went wrong during account deletion');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading user profile...</span>
      </div>
    );
  }

  if (error) return <p className="text-danger">Error: {error}</p>;
  if (deleteMsg) return <Alert variant="success">{deleteMsg}</Alert>;
  if (!userData) return <p>No user data found.</p>;

  return (
    <>
      <NavBar />
      <Card className="mx-auto mt-4 shadow-sm" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title>User Profile</Card.Title>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Location:</strong> {userData.location}</p>
          <p><strong>Gender:</strong> {userData.gender}</p>
          <p><strong>User Type:</strong> {userData.type}</p>
          <Button variant="danger" className="mt-3" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserProfile;
