// src/components/FeaturedProducts.tsx
import React from 'react';
// import './FeaturedProducts.css';
import './ProductCard.css'

interface Product {
  id: number;
  title: string;
  price: string;
  img: string;
}

const products: Product[] = [
  { id:1, title:'Wireless Earbuds', price:'$79.99', img:'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7' },
  { id:2, title:'Stylish Sunglasses', price:'$35.50', img:'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759' },
  { id:3, title:'Modern Table Lamp', price:'$49.95', img:'https://images.unsplash.com/photo-1493666438817-866a91353ca9' },
  { id:4, title:'Cozy Hoodie', price:'$59.00', img:'https://images.unsplash.com/photo-1520974735194-69333a53ef1d' },
  { id:5, title:'Smart Speaker', price:'$129.99', img:'https://images.unsplash.com/photo-1580910051077-1d6a215ec416' },
  { id:6, title:'Leather Wallet', price:'$45.00', img:'https://images.unsplash.com/photo-1518606373210-fd0dcd8e4544' },
];

const FeaturedProducts: React.FC = () => (
  <section className="featured-products">
    <h2>Featured Products</h2>
    <div className="product-grid">
      {products.map((p) => (
        <div key={p.id} className="product-card">
          <img src={p.img} alt={p.title} />
          <h3>{p.title}</h3>
          <p className="price">{p.price}</p>
          <button className="add-cart">Add to Cart</button>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedProducts;
