import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OtpVerification.css';
import axios from 'axios';

const OtpVerification = () => {
  // State to manage OTP input and timer
  // Use useState to handle OTP input, timer, and resending state
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  // Handle OTP input change
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleVerifyOtp = async () => {
    // Validate OTP input
    // Use async/await to handle the OTP verification process
    try {
      const response = await axios.post('http://localhost:8080/forgot/verify-otp', { email, otp });
      alert(response.data);
      navigate('/reset-password');
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || resending) return;
    // Resend OTP if timer is expired or not in resending state
    // Use async/await to handle the resend OTP process
    try {
      setResending(true);
      const response = await axios.post('http://localhost:8080/forgot/send-otp', { email });
      alert(response.data);
      setTimer(60); // reset timer
    } catch (error) {
      alert('Resend failed. Try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify OTP 📩</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerifyOtp}>Verify</button>

      <div style={{ marginTop: '15px' }}>
        <button
          onClick={handleResendOtp}
          disabled={timer > 0 || resending}
        >
          {resending ? 'Resending...' : timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
