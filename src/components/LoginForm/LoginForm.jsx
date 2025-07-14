import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  // State to manage form data
  // Use useState to handle form inputs for email and password
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Update form data state on input change
    // Use spread operator to maintain other form data
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    // Prevent default form submission
    // Use async/await to handle the login process
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          email: formData.email,
          role: data.role
        }));

        // Redirect based on role
        if (data.role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }

      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        {error && <div className="login-error">{error}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="login-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="login-input"
        />

        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="login-link">
          <span onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
        </p>
      </form>

      <p className="login-link">
        Don't have an account?{' '}
        <span onClick={() => navigate('/signup')}>Sign Up</span>
      </p>
    </div>
  );
};

export default LoginForm;
