import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to ShopWise</h1>
          <p>Your one-stop shop for everything awesome.</p>
          <a href="/login" className="cta-button">Start Shopping</a>
        </div>
      </div>

      <section className="features">
        <h2>Why Shop With Us?</h2>
        <div className="feature-grid">
          <div className="feature-card">Free Shipping</div>
          <div className="feature-card">24/7 Support</div>
          <div className="feature-card">Best Prices</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
