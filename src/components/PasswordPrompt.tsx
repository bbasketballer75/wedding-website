import React, { useState } from 'react';

interface PasswordPromptProps {
  onPasswordSubmit: (password: string) => void;
  isError?: boolean;
  message?: string;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({
  onPasswordSubmit,
  isError = false,
  message = 'Please enter the password to continue',
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div className="password-prompt">
      <div className="prompt-content">
        <h2 className="prompt-title">Access Required</h2>
        <p className="prompt-message">{message}</p>
        {isError && (
          <div className="error-message" role="alert">
            Incorrect password. Please try again.
          </div>
        )}
        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="password-input"
              required
              autoFocus
            />
          </div>
          <button type="submit" className="submit-button">
            Continue
          </button>
        </form>
      </div>
      <style>{`
        .password-prompt {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          padding: 2rem;
        }

        .prompt-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .prompt-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .prompt-message {
          color: #4a5568;
          margin-bottom: 1.5rem;
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .password-input {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .password-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .submit-button:focus {
          outline: 3px solid rgba(102, 126, 234, 0.5);
          outline-offset: 2px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default PasswordPrompt;
