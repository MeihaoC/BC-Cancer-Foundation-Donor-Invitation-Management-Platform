import React from 'react';
import '../css/Sidebar.css';
import { FaHandHoldingHeart, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <Link to="/donors">
          <span className="icon"><FaHandHoldingHeart /></span>
          Donors
        </Link>
        <Link to="/events">
          <span className="icon"><FaGlobe /></span>
          Events
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
