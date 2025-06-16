import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Login: React.FC = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      alert('Login successful!');
      // Navigate to dashboard or home after login
    } catch (error: any) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
