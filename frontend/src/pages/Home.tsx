import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="home-container">
      <Navbar />

      <Categories onSelectCategory={(category) => setSelectedCategory(category)} />

      {/* Optional: Display current selected category */}
      {selectedCategory && (
        <div className="selected-category-banner">
          Showing products for <strong>{selectedCategory}</strong>
        </div>
      )}

      {/* We'll wire this to use the selected category later */}
      <FeaturedProducts />

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
