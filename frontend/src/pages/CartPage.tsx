import React from 'react';
import { useCart,CartItem } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="home-container">
      <Navbar />
      <div className="cart-page">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item:CartItem) => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.title} />
                <div className="cart-details">
                  <h3>{item.title}</h3>
                  <p>Price: ₹{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="cart-summary">
              <h3>Total: ₹{total.toFixed(2)}</h3>
              <button className="checkout-btn" onClick={()=> navigate('/checkout')}>Checkout</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
