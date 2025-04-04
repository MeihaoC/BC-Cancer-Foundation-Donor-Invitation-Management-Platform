import React from 'react';
import '../css/Topbar.css';
import { FaUser } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="logo">Donor Invitation Management System</div>
      <div className="user-icon">
        <FaUser />
      </div>
    </div>
  );
};

export default Topbar;
