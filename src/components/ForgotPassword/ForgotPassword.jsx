import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import axios from 'axios';

const ForgotPassword = () => {
  // State to manage email input
  // Use useState to handle the email input for sending OTP
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    // Validate email input
    try {
      const response = await axios.post('http://localhost:8080/forgot/send-otp', { email });
      alert(response.data);
      localStorage.setItem('resetEmail', email);
      navigate('/verify-otp');
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password 🔑</h2>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOtp}>Send OTP</button>
    </div>
  );
};

export default ForgotPassword;
