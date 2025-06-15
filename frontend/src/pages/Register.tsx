import React from 'react';
import axios from 'axios';
import AuthForm from '../components/AuthForm';

const Register: React.FC = () => {
  const handleRegister = async (email: string, password: string) => {
    try {
      await axios.post('http://localhost:3001/api/register', {
        email,
        password,
      });

      alert('Registration successful! You can now log in.');
      // You might want to redirect to login page here
    } catch (error: any) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default Register;
