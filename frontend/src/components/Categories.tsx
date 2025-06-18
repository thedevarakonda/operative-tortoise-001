// src/components/Categories.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Categories.css';
import { useNavigate } from 'react-router-dom';


interface Category {
  id: number;
  name: string;
}

interface CategoriesProps {
  onSelectCategory?: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/categories')
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load categories');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="categories-container">Loading...</div>;
  if (error) return <div className="categories-container error">{error}</div>;

  return (
    <div className="categories-container">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="category-item"
          onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
};

export default Categories;
