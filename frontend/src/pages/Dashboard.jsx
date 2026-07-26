import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import './Dashboard.css';

function Dashboard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  const enrollments = user?.enrollments?.length || 0;
  const completed = user?.enrollments?.filter(e => e.completed)?.length || 0;
  const quizzesPassed = user?.quizAttempts?.filter(q => q.passed)?.length || 0;
  const certificates = user?.certificates?.length || 0;

  return (
    <div className="dashboard-page">
      {/* Hero Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-greeting">
            <div>
              <h1 className="hero-title">
                Hello, <span className="hero-name">{user?.firstName} {user?.lastName}</span>
              </h1>
              <p className="hero-subtitle">
                Ready to continue your learning journey? You're doing great!
              </p>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-hero-primary">
              Browse Courses
            </Link>
            <Link to="/certificates" className="btn btn-hero-secondary">
              My Certificates
            </Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="dashboard-main">
        <div className="section-header">
          <h2 className="section-title">Your Progress Overview</h2>
          <p className="section-subtitle">Track your learning achievements at a glance</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Courses Enrolled</p>
              <h3 className="stat-value">{enrollments}</h3>
              <p className="stat-trend">Total courses</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Completed</p>
              <h3 className="stat-value">{completed}</h3>
              <p className="stat-trend">Finished courses</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Quizzes Passed</p>
              <h3 className="stat-value">{quizzesPassed}</h3>
              <p className="stat-trend">Evaluations</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Certificates</p>
              <h3 className="stat-value">{certificates}</h3>
              <p className="stat-trend">Earned badges</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="activity-header">
            <h3 className="activity-title">Recent Activity</h3>
            <Link to="/courses" className="activity-link">View all courses →</Link>
          </div>
          <div className="activity-empty">
            <h4>Start your learning journey</h4>
            <p>Enroll in a course to see your activity here</p>
            <Link to="/courses" className="btn btn-primary">
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
