import React, { useState } from 'react';
import './AuthForm.css';
import { Link } from 'react-router-dom';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (email: string, password: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{type === 'login' ? 'Welcome Back 👋' : 'Create an Account 📝'}</h2>

        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{type === 'login' ? 'Log In' : 'Register'}</button>
        <p className="switch-auth">
        
        {type === 'login' ? (
            <>Don’t have an account? <Link to="/register">Register</Link></>
            ) : (
            <>Already have an account? <Link to="/login">Login</Link></>
            )}
        </p>
        
      </form>
    </div>
  );
};

export default AuthForm;
