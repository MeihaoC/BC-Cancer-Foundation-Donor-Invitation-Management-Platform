import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Topbar.css';
import { FaSignOutAlt } from 'react-icons/fa';

const Topbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // Check if user is actually logged in
  const isLoggedIn = token && user && Object.keys(user).length > 0;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="topbar">
      <div className="logo">Donor Invitation Management System</div>
      {isLoggedIn && (
        <div className="user-section">
          <span className="user-name">{user.name || 'User'}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Topbar;
