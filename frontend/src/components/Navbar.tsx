import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Later: navigate(`/search?query=${searchTerm}`);
    alert(`Searching for "${searchTerm}"...`);
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        🛍️ ShopWise
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        {/* <span className="navbar-search-icon">🔍</span> */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className="navbar-links">
        {token ? (
          <div className="navbar-profile-container">
            <div
              className="navbar-profile-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              👤
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/profile')}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
