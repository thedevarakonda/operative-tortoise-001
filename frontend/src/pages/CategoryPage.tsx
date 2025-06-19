// src/pages/CategoryPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CategoryPage.css';
import '../components/ProductCard.css'
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  image_url: string;
}

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();


  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/products?category=${categoryName}`)
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <div className="home-container">
      <Navbar />
      <div className="category-page">
        <h2 className="category-heading">{categoryName}</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.image_url} alt={p.title} />
                <h3>{p.title}</h3>
                <p>₹{p.price}</p>
                <StarRating rating={p.rating} />
                <button className="add-cart" onClick={() => addToCart({ ...p, quantity: 1 })}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;