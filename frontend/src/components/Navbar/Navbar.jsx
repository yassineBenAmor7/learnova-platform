import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, BookOpen, LayoutDashboard, Shield, Award, Flame, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          Learnova<span className="logo-dot">.</span>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/courses" className="navbar-link">
                <BookOpen size={18} />
                <span>Courses</span>
              </Link>
              <Link to="/dashboard" className="navbar-link">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/certificates" className="navbar-link">
                <Award size={18} />
                <span>Certificates</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className="navbar-link admin-link">
                  <Shield size={18} />
                  <span>Admin</span>
                </Link>
              )}
            </>
          ) : (
            <Link to="/" className="navbar-link">Home</Link>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user-section">
              {user?.gamification && (
                <div className="navbar-gamification">
                  <div className="gamification-item tooltip" title="Consecutive learning days">
                    <Flame size={18} className="icon-streak" />
                    <span>{user.gamification.currentStreak || 0}d</span>
                  </div>
                  <div className="gamification-item tooltip" title="Current level (XP)">
                    <Award size={18} className="icon-points" />
                    <span>Lvl. {user.gamification.level || 1}</span>
                  </div>
                </div>
              )}
              <Link to="/profile" className="navbar-user-info" title="My Profile">
                <User size={16} className="user-icon" />
                <span className="user-name">{user?.firstName}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm-nav">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm-nav">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
