import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';

const SignupForm = () => {
  // State to manage form data
  // Use useState to handle form inputs for name, email, and password

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  // Use async/await to handle the signup process
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        password: formData.password
      })
    });

    if (response.ok) {
      // Success - navigate to login page
      navigate('/login');
    } else {
      // Backend error - show message
      const error = await response.text();
      alert(`Signup failed: ${error}`);
    }
  } catch (err) {
    // Network/server error
    console.error(err);
    alert('Something went wrong while signing up. Please try again later.');
  }
};

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <button type="submit">Sign Up</button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account?{' '}
        <span style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>
          Login
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
