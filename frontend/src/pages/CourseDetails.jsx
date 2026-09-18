import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  CheckCircle,
  ChevronRight,
  FileText,
  Layers,
  Video,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { courseService } from '../services/course.service';
import CheckoutModal from '../components/CheckoutModal';
import { useToast } from '../contexts/ToastContext';
import { getCourseThumbnail, handleThumbnailError } from '../utils/thumbnailHelper';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const courseData = await courseService.getById(id);
        setCourse(courseData);

        try {
          const enrollments = await courseService.getMyEnrollments();
          const isEnrolled = enrollments.some((e) => e.courseId === parseInt(id, 10));
          setEnrolled(isEnrolled);
        } catch (enrollError) {
          console.error('Error checking enrollment:', enrollError);
        }
      } catch (fetchError) {
        setError('Failed to load course details');
        console.error('Error fetching course:', fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const sortedSessions = useMemo(
    () => [...(course?.sessions || [])].sort((a, b) => a.orderNumber - b.orderNumber),
    [course?.sessions],
  );

  const totalVideos = useMemo(
    () => sortedSessions.reduce((acc, session) => acc + (session.videos?.length || 0), 0),
    [sortedSessions],
  );

  const hasQuiz = (course?.quizzes?.length || 0) > 0;

  const handleEnroll = async () => {
    try {
      await courseService.enroll(id);
      setEnrolled(true);
      navigate(`/learning-path/${id}`);
    } catch (enrollError) {
      console.error('Error enrolling in course:', enrollError);
      toast.error('Failed to enroll in course. Please try again.');
    }
  };

  const handleStartLearning = () => {
    navigate(`/learning-path/${id}`);
  };

  const handleSessionClick = (sessionId) => {
    navigate(`/learning-path/${id}?session=${sessionId}`);
  };

  const handleSessionKeyDown = (event, sessionId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSessionClick(sessionId);
    }
  };

  if (loading) {
    return (
      <div className="course-details-loading">
        <div className="loading-spinner" />
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button type="button" onClick={() => navigate('/courses')} className="btn-back">
          Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-details-error">
        <h2>Course not found</h2>
        <button type="button" onClick={() => navigate('/courses')} className="btn-back">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="course-details-page">
      <header className="course-hero">
        <div className="course-details-container">
          <nav className="course-breadcrumb" aria-label="Breadcrumb">
            <button type="button" className="breadcrumb-link" onClick={() => navigate('/courses')}>
              Courses
            </button>
            <ChevronRight size={14} className="breadcrumb-separator" aria-hidden="true" />
            <span className="breadcrumb-current">{course.title}</span>
          </nav>

          <div className="course-hero-body">
            <div className="course-hero-text">
              <h1 className="course-title">{course.title}</h1>
              <p className="course-description">{course.description}</p>

              <div className="course-meta">
                <span className="meta-pill">
                  <BookOpen size={16} aria-hidden="true" />
                  {course.creator?.firstName} {course.creator?.lastName}
                </span>
                <span className="meta-pill">
                  <Layers size={16} aria-hidden="true" />
                  {sortedSessions.length} sessions
                </span>
                <span className="meta-pill">
                  <Video size={16} aria-hidden="true" />
                  {totalVideos} videos
                </span>
                <span className={`meta-pill level-pill level-${(course.level || 'BEGINNER').toLowerCase()}`}>
                  <TrendingUp size={16} aria-hidden="true" />
                  {course.level === 'ADVANCED' && 'Advanced (2.0x Points)'}
                  {course.level === 'INTERMEDIATE' && 'Intermediate (1.5x Points)'}
                  {course.level === 'ALL_LEVELS' && 'All Levels (1.25x Points)'}
                  {(!course.level || course.level === 'BEGINNER') && 'Beginner (1.0x Points)'}
                </span>
                <span className="meta-pill meta-pill-accent">
                  <Award size={16} aria-hidden="true" />
                  Certificate included
                </span>
              </div>
            </div>

            <div className="course-hero-media">
              <img 
                src={getCourseThumbnail(course)} 
                alt={course.title} 
                className="course-hero-image"
                onError={(e) => handleThumbnailError(e, course.domain)} 
              />
            </div>
          </div>
        </div>
      </header>

      <div className="course-details-container">
        <div className="course-layout">
          <main className="course-layout-main">
            <section className="course-section" aria-labelledby="about-heading">
              <div className="section-header">
                <div className="section-icon" aria-hidden="true">
                  <FileText size={20} />
                </div>
                <div className="section-heading">
                  <h2 id="about-heading" className="section-title">About This Course</h2>
                  <p className="section-subtitle">Overview and learning objectives</p>
                </div>
              </div>
              <p className="section-text">{course.description}</p>
            </section>

            <section className="course-section course-sessions-section" aria-labelledby="content-heading">
              <div className="section-header">
                <div className="section-icon" aria-hidden="true">
                  <Layers size={20} />
                </div>
                <div className="section-heading">
                  <h2 id="content-heading" className="section-title">Course Content</h2>
                  <p className="section-subtitle">
                    {sortedSessions.length} sessions · {totalVideos} videos
                    {hasQuiz ? ' · Quiz included' : ''}
                  </p>
                </div>
                <span className="section-badge">{sortedSessions.length}</span>
              </div>

              <div className="sessions-list">
                {sortedSessions.length > 0 ? (
                  sortedSessions.map((session, index) => (
                    <article
                      key={session.id}
                      className="session-item"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSessionClick(session.id)}
                      onKeyDown={(event) => handleSessionKeyDown(event, session.id)}
                      aria-label={sortedSessions.length > 1 ? `Open session ${index + 1}: ${session.title}` : `Open session: ${session.title}`}
                    >
                      {sortedSessions.length > 1 && (
                        <div className="session-index">{String(index + 1).padStart(2, '0')}</div>
                      )}
                      <div className="session-number" aria-hidden="true">
                        <PlayCircle size={22} className="play-icon" />
                      </div>
                      <div className="session-info">
                        <h3 className="session-title">
                          {sortedSessions.length === 1 ? session.title.replace(/^Session\s*1\s*[:\-]\s*/i, 'Session: ') : session.title}
                        </h3>
                        <div className="session-meta">
                          <p className="session-duration">
                            <Clock size={14} aria-hidden="true" />
                            {session.videos?.length || 0} video{(session.videos?.length || 0) !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {session.description && (
                          <p className="session-description">{session.description}</p>
                        )}
                      </div>
                      <ChevronRight size={18} className="session-chevron" aria-hidden="true" />
                    </article>
                  ))
                ) : (
                  <p className="sessions-empty">No sessions available yet</p>
                )}
              </div>
            </section>
          </main>

          <aside className="course-sidebar">
            <div className="course-card">
              <div className="course-card-header">
                <div className="course-card-price-container">
                  <div className="price-row-header">
                    {course.isPaid && course.price > 0 ? (
                      <div className="card-price-wrapper">
                        <span className="card-price-label">Course Price:</span>
                        <span className="card-price-amount">${course.price.toFixed(2)} USD</span>
                      </div>
                    ) : (
                      <div className="card-price-wrapper">
                        <span className="card-price-label">Pricing:</span>
                        <span className="card-price-amount free-amount">FREE</span>
                      </div>
                    )}
                    {enrolled && (
                      <span className="enrolled-badge-pill">
                        <CheckCircle size={14} aria-hidden="true" />
                        Enrolled
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-instructor">
                  By {course.creator?.firstName} {course.creator?.lastName}
                </p>
              </div>

              <div className="course-stats-grid">
                <div className="stat-card">
                  <span className="stat-value">{sortedSessions.length}</span>
                  <span className="stat-label">Sessions</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{totalVideos}</span>
                  <span className="stat-label">Videos</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{hasQuiz ? 'Yes' : 'No'}</span>
                  <span className="stat-label">Quiz</span>
                </div>
              </div>

              {enrolled ? (
                <button type="button" onClick={handleStartLearning} className="btn btn-primary btn-full btn-cta">
                  Continue Learning
                </button>
              ) : course.isPaid && course.price > 0 ? (
                <div>
                  <button 
                    type="button" 
                    onClick={() => setShowCheckoutModal(true)} 
                    className="btn btn-primary btn-full btn-cta btn-buy-now"
                  >
                    Buy Now — ${course.price.toFixed(2)}
                  </button>
                  <p className="guarantee-subtext">30-Day Money-Back Guarantee</p>
                </div>
              ) : (
                <button type="button" onClick={handleEnroll} className="btn btn-primary btn-full btn-cta">
                  Enroll For Free
                </button>
              )}

              <ul className="course-features">
                <li className="feature-item">
                  <CheckCircle size={16} aria-hidden="true" />
                  <span>Lifetime access</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} aria-hidden="true" />
                  <span>Certificate of completion</span>
                </li>
                <li className="feature-item">
                  <CheckCircle size={16} aria-hidden="true" />
                  <span>Structured learning path</span>
                </li>
                {hasQuiz && (
                  <li className="feature-item">
                    <HelpCircle size={16} aria-hidden="true" />
                    <span>Knowledge check quiz</span>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {showCheckoutModal && (
        <CheckoutModal
          course={course}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={() => {
            setEnrolled(true);
            setShowCheckoutModal(false);
            navigate(`/learning-path/${course.id}`);
          }}
        />
      )}
    </div>
  );
};

export default CourseDetails;
