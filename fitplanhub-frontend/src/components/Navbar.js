import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          FitPlanHub
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">All Plans</Link>
          {user ? (
            <>
              {user.role === 'USER' && (
                <>
                  <Link to="/feed" className="nav-link">My Feed</Link>
                  <Link to="/following" className="nav-link">Following</Link>
                </>
              )}
              {user.role === 'TRAINER' && (
                <Link to="/trainer/dashboard" className="nav-link">Dashboard</Link>
              )}
              <span className="nav-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

