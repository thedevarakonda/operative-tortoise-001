import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        🛍️ ShopWise
      </div>

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
