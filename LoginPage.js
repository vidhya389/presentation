import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { totalCost } = useLocation().state;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate username and password
    if (username && password) {
      navigate('/consent', { state: {totalCost } });
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div className="login-container">
      <h2>Online Banking</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer Number:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Enter your customer number"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Enter your password"
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default LoginPage;