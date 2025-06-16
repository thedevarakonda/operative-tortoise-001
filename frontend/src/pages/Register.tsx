import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Register: React.FC = () => {
  const handleRegister = async (email: string, password: string) => {
    try {
      await axios.post('http://localhost:3001/api/register', {
        email,
        password,
      });
      alert('Registration successful! You can now log in.');
      // Optionally navigate to login
    } catch (error: any) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div>
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
