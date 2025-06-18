// src/components/Categories.tsx
import React from 'react';
import './Categories.css';

const categories = [
  'Electronics',
  'Fashion',
  'Home',
  'Books',
  'Beauty',
  'Sports',
  'Toys',
  'Groceries',
];

const Categories: React.FC = () => {
  return (
    <div className="categories-container">
      {categories.map((cat, idx) => (
        <div key={idx} className="category-item">
          {cat}
        </div>
      ))}
    </div>
  );
};

export default Categories;
