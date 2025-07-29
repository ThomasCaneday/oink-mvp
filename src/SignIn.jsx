import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

const SignIn = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLogging(true);
    setError('');

    try {
      const success = await login(email);
      if (!success) {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1>Welcome to Oink</h1>
          <p>Micro-investing made simple</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLogging}
              className="email-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!email || isLogging}
            className="signin-btn"
          >
            {isLogging ? 'Sending Magic Link...' : 'Sign In with Magic Link'}
          </button>
        </form>

        <div className="signin-footer">
          <p>We'll send you a secure magic link to sign in without a password.</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
