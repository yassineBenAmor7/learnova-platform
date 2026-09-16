import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboard.service';
import './Home.css';

function Home() {
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState('');

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await dashboardService.getPublicOverview();
        setOverview(data);
      } catch (err) {
        setOverviewError(err.message || 'Unable to load statistics.');
      } finally {
        setLoadingOverview(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <main className="home-page page-wrapper">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">Learnova Platform</span>
          <h1>Learn Smarter. Advance Faster. Certify Your Success.</h1>
          <p>
            Learnova is the professional e-learning platform combining interactive masterclasses, practice quizzes, real-time progress tracking, and official Coursera/Udemy-level certificates in a modern interface.
          </p>
          <div className="home-actions">
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Create Free Account
            </Link>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-card">
            <div className="hero-card-top">
              <span className="hero-badge">Learning Dashboard</span>
              <span className="hero-status">Live Stats</span>
            </div>
            <div className="hero-card-body">
              <div className="hero-metric">
                <strong>{loadingOverview ? '...' : overview?.totalCourses ?? '0'}</strong>
                <span>Available Courses</span>
              </div>
              <div className="hero-metric">
                <strong>{loadingOverview ? '...' : overview?.totalEnrollments ?? '0'}</strong>
                <span>Total Enrollments</span>
              </div>
              <div className="hero-metric">
                <strong>{loadingOverview ? '...' : overview?.totalCertificates ?? '0'}</strong>
                <span>Certificates Issued</span>
              </div>
            </div>
            <div className="hero-card-footer">
              {overviewError
                ? 'Statistics available in real-time.'
                : 'Track your progress, access top masterclasses, and earn verified certificates.'}
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <h2>An E-Learning Experience Designed for Excellence</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Personalized Learning Paths</h3>
            <p>Tailored course recommendations adapted to your career goals, skill level, and learning pace.</p>
          </article>
          <article className="feature-card">
            <h3>Real-Time Progress Tracking</h3>
            <p>Track your completed lectures, acquired skills, and milestone goals in one unified dashboard.</p>
          </article>
          <article className="feature-card">
            <h3>Interactive Quizzes & Final Exams</h3>
            <p>Session practice quizzes and timed final certification exams that validate your knowledge.</p>
          </article>
          <article className="feature-card">
            <h3>Verified Official Certificates</h3>
            <p>Earn shareable, printable Coursera & Udemy level certificates with unique verification IDs.</p>
          </article>
        </div>
      </section>

      <section className="home-cta-block">
        <div className="home-cta-card">
          <div>
            <h2>Start Your Learnova Journey Today</h2>
            <p>Join thousands of learners mastering in-demand skills with interactive courses and instant certifications.</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-large">
            Create Your Free Account
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
