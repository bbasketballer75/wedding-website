import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PasswordPrompt.css';

const PasswordPrompt = ({ onCorrectPassword }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd verify this with the backend.
    // For this simple auth, we just store it and let the backend validate.
    onCorrectPassword(password);
  };

  return (
    <div className="password-prompt-container">
      <h2>Admin Access Required</h2>
      <p>Please enter the admin key to continue.</p>
      <form onSubmit={handleSubmit} className="password-form">
        <label htmlFor="admin-password" className="sr-only">
          Admin Key
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin key"
          className="password-input"
          autoFocus
          aria-label="Enter admin key"
          required
        />
        <button type="submit" className="password-submit-button">
          Unlock
        </button>
      </form>
    </div>
  );
};

// PropTypes for validation
PasswordPrompt.propTypes = {
  onCorrectPassword: PropTypes.func.isRequired,
};

export default PasswordPrompt;
