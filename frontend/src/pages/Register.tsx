import React from 'react';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {

  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string) => {
    try {
      await axios.post('http://localhost:3001/api/register', {
        email,
        password,
      });
      alert('Registration successful! Please login now.');
      // Optionally navigate to login
      navigate('/login');
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
