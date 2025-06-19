// src/pages/CheckoutPage.tsx
import React, { useState,useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CheckoutPage.css';
import axios from 'axios';

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
const [profile, setProfile] = useState<{ email: string; id: number; created_at: string } | null>(null);
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:3001/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);


  const handlePlaceOrder = async () => {
    if (!name || !address) {
      setError('Please fill in all fields');
      return;
    }

    if (!token) {
      setError('User not logged in');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: Number(profile?.id) })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Order failed');
      }

    //   clearCart();
      alert("Your Order is Succesful !");
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="checkout-container">
        <h2>Checkout</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <span>{item.title} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="checkout-total">
                <strong>Total: ₹{total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="checkout-form">
              <h3>Shipping Details</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                placeholder="Shipping Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {error && <p className="error">{error}</p>}
              <button onClick={handlePlaceOrder}>Place Order</button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
