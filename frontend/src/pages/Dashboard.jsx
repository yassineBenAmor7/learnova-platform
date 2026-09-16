import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { dashboardService } from '../services/dashboard.service';
import { gamificationService } from '../services/gamification.service';
import Badge from '../components/Badge/Badge';
import { BookOpen, Award, FileText, TrendingUp, Star, Flame } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const { user: authUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [gamificationData, setGamificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({
    enrollments: 0,
    completed: 0,
    quizzesPassed: 0,
    certificates: 0,
    points: 0,
    currentStreak: 0,
    badgesCount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getMyDashboard();
        console.log('Dashboard data received:', data);
        setDashboardData(data);

        const [points, badges, streak] = await Promise.all([
          gamificationService.getMyPoints(),
          gamificationService.getMyBadges(),
          gamificationService.getMyStreak(),
        ]);
        console.log('Gamification data loaded:', { points, badges, streak });
        setGamificationData({ points, badges, streak });
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!loading && dashboardData && gamificationData) {
      const rawBadges = Array.isArray(gamificationData?.badges) ? gamificationData.badges : (gamificationData?.badges?.badges || []);
      const earnedBadges = rawBadges.filter(b => b.unlocked !== false);

      const targetValues = {
        enrollments: dashboardData?.statistics?.totalCourses || 0,
        completed: dashboardData?.statistics?.completedCourses || 0,
        quizzesPassed: dashboardData?.statistics?.passedQuizzes || 0,
        certificates: dashboardData?.statistics?.totalCertificates || 0,
        points: gamificationData?.points?.totalPoints || 0,
        currentStreak: gamificationData?.streak?.currentStreak || 0,
        badgesCount: earnedBadges.length,
      };

      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        setAnimatedValues({
          enrollments: Math.floor(targetValues.enrollments * easeProgress),
          completed: Math.floor(targetValues.completed * easeProgress),
          quizzesPassed: Math.floor(targetValues.quizzesPassed * easeProgress),
          certificates: Math.floor(targetValues.certificates * easeProgress),
          points: Math.floor(targetValues.points * easeProgress),
          currentStreak: Math.floor(targetValues.currentStreak * easeProgress),
          badgesCount: Math.floor(targetValues.badgesCount * easeProgress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedValues(targetValues);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [loading, dashboardData, gamificationData]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <span>Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-loading">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const userName = authUser?.firstName || 'User';
  const userLastName = authUser?.lastName || '';
  const fullName = userLastName ? `${userName} ${userLastName}` : userName;
  const allBadges = Array.isArray(gamificationData?.badges) ? gamificationData.badges : (gamificationData?.badges?.badges || []);
  const earnedBadges = allBadges.filter(b => b.unlocked !== false);
  const latestBadge = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : null;

  return (
    <div className="dashboard-page">
      {/* Hero Banner */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-greeting">
            <div>
              <h1 className="hero-title">
                Hello, {fullName}
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
            <div className="stat-icon">
              <BookOpen size={32} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Courses Enrolled</p>
              <h3 className="stat-value">{animatedValues.enrollments}</h3>
              <p className="stat-trend">Total courses</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Award size={32} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Completed</p>
              <h3 className="stat-value">{animatedValues.completed}</h3>
              <p className="stat-trend">Finished courses</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={32} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Quizzes Passed</p>
              <h3 className="stat-value">{animatedValues.quizzesPassed}</h3>
              <p className="stat-trend">Evaluations</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={32} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Certificates</p>
              <h3 className="stat-value">{animatedValues.certificates}</h3>
              <p className="stat-trend">Earned badges</p>
            </div>
          </div>
        </div>

        {/* Gamification Section */}
        <div className="gamification-section">
          <div className="section-header">
            <h2 className="section-title">Your Achievements</h2>
            <p className="section-subtitle">Unlock badges, levels, and learning streaks as you master new skills</p>
          </div>
          <div className="gamification-grid">
            <div className="gamification-card">
              <div className="gamification-icon">
                <Star size={32} />
              </div>
              <div className="gamification-info">
                <p className="gamification-label">Total Points</p>
                <h3 className="gamification-value">{animatedValues.points}</h3>
                <p className="gamification-sub">Level {gamificationData?.points?.level || 1}</p>
              </div>
            </div>

            <div className="gamification-card">
              <div className="gamification-icon">
                <Flame size={32} />
              </div>
              <div className="gamification-info">
                <p className="gamification-label">Current Streak</p>
                <h3 className="gamification-value">{animatedValues.currentStreak} days</h3>
                <p className="gamification-sub">Keep learning!</p>
              </div>
            </div>

            <div className="gamification-card">
              <div className="gamification-icon">
                <Award size={32} />
              </div>
              <div className="gamification-info">
                <p className="gamification-label">Badges Earned</p>
                <h3 className="gamification-value">{animatedValues.badgesCount}</h3>
                <p className="gamification-sub">{animatedValues.badgesCount} achievements</p>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          {gamificationData?.points && (
            <div className="level-progress">
              <div className="level-info">
                <span className="level-label">Level {gamificationData.points.level}</span>
                <span className="level-next">{gamificationData.points.pointsToNextLevel || 0} pts to next level</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (gamificationData.points.totalPoints % 100))}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Recent Badge Container */}
          {latestBadge && (
            <div className="recent-badge-card">
              <div className="recent-badge-top">
                <span className="recent-badge-pill">Recent Badge</span>
                <span className="recent-badge-level-info">Level {gamificationData?.points?.level || 1} Honor</span>
              </div>
              <div className="recent-badge-main">
                <Badge badge={latestBadge} size="medium" showLabel={true} />
              </div>
            </div>
          )}

          {/* Earned Badges Showcase */}
          <div className="badges-display">
            <div className="badges-header-row">
              <h4 className="badges-title">Earned Badges ({earnedBadges.length})</h4>
              <Link to="/profile" className="view-profile-badges-link">View in Profile →</Link>
            </div>
            {earnedBadges.length > 0 ? (
              <div className="badges-grid-container">
                {earnedBadges.map((badge) => (
                  <Badge key={badge.id || badge.name} badge={badge} size="medium" />
                ))}
              </div>
            ) : (
              <p className="no-badges-msg">
                No badges earned yet. Complete sessions, pass practice quizzes, and finish courses to unlock your first badges!
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="activity-header">
            <h3 className="activity-title">Recent Activity</h3>
            <Link to="/courses" className="activity-link">View all courses →</Link>
          </div>
          {(dashboardData?.recentQuizAttempts?.length > 0 || dashboardData?.recentCourses?.length > 0) ? (
            <div className="activity-list">
              {dashboardData.recentQuizAttempts?.slice(0, 5).map((attempt) => (
                <div key={`quiz-${attempt.id}`} className="activity-item">
                  <div className="activity-item-content">
                    <FileText size={18} />
                    <div>
                      <p className="activity-item-title">
                        {attempt.passed ? 'Passed' : 'Attempted'} quiz: {attempt.quizTitle}
                      </p>
                      <p className="activity-item-meta">
                        {attempt.courseTitle} • Score: {Math.round(attempt.score || 0)}%
                      </p>
                    </div>
                  </div>
                  <div className="activity-item-date">
                    {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </div>
                </div>
              ))}
              {dashboardData.recentCourses?.slice(0, 3).map((course) => (
                <div key={`course-${course.id}`} className="activity-item">
                  <div className="activity-item-content">
                    <BookOpen size={18} />
                    <div>
                      <p className="activity-item-title">Continuing: {course.title}</p>
                      <p className="activity-item-meta">{Math.round(course.progress || 0)}% complete</p>
                    </div>
                  </div>
                  <div className="activity-item-date">
                    {course.lastAccess ? new Date(course.lastAccess).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="activity-empty">
              <h4>Start your learning journey</h4>
              <p>Enroll in a course to see your activity here</p>
              <Link to="/courses" className="btn btn-primary">
                Explore Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
