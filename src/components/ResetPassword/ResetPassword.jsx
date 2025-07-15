import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import axios from 'axios';
/*
  * ResetPassword component to handle password reset functionality.
  * It allows users to set a new password after requesting a reset link.
  * It uses useState to manage the new password and confirmation input fields.
  * It uses useNavigate to redirect the user after a successful reset.
*/

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/forgot/reset-password', {
        email,
        newPassword: password,
        confirmPassword: confirmPassword
      });
      alert(response.data);
      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data || 'Reset failed. Try again.');
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset Password 🔐</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
