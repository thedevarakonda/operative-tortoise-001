import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo">ShopWise</div>
      <input type="text" placeholder="Search products..." className="search-bar" />
      <div className="nav-links">
        {/* <Link to="/">Home</Link> */}
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
