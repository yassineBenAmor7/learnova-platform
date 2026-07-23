import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import './Dashboard.css';

function Dashboard() {
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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Learnova</h1>
          <div className="user-info">
            <span>Hello, {user?.firstName} {user?.lastName}</span>
            <button onClick={handleLogout} className="logout-button">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to your Dashboard</h2>
          <p>Continue your learning journey with Learnova</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>Courses</h3>
              <p className="stat-value">{user?.enrollments?.length || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Completed</h3>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>Quizzes Passed</h3>
              <p className="stat-value">{user?.quizAttempts?.filter(q => q.passed)?.length || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>Certificates</h3>
              <p className="stat-value">{user?.certificates?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <p className="no-activity">No recent activity</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
