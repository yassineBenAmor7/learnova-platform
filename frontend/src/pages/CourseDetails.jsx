import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/course.service';
import './CourseDetails.css';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getById(id);
      setCourse(data);
    } catch (err) {
      setError('Failed to load course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await courseService.enroll(id);
      navigate(`/learning-path/${id}`);
    } catch (err) {
      setError('Failed to enroll in course');
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="course-details-container">
        <div className="loading">Loading course details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-details-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-details-container">
        <div className="alert alert-warning">Course not found</div>
      </div>
    );
  }

  return (
    <div className="course-details-container">
      <div className="course-header">
        <Link to="/courses" className="back-link">
          ← Back to Courses
        </Link>
        <h1 className="course-title">{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <div className="course-meta">
          <span className="course-sessions">
            {course.sessions?.length || 0} sessions
          </span>
          <span className="course-level">
            {course.level || 'All Levels'}
          </span>
        </div>
      </div>

      <div className="course-content">
        <div className="course-sessions-section">
          <h2>Course Sessions</h2>
          {course.sessions && course.sessions.length > 0 ? (
            <div className="sessions-list">
              {course.sessions.map((session, index) => (
                <div key={session.id} className="session-item">
                  <div className="session-number">
                    Session {index + 1}
                  </div>
                  <div className="session-info">
                    <h3 className="session-title">{session.title}</h3>
                    <p className="session-description">{session.description}</p>
                    <div className="session-meta">
                      <span className="session-videos">
                        {session.videos?.length || 0} videos
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-sessions">No sessions available yet</p>
          )}
        </div>

        <div className="course-action-section">
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="btn btn-primary btn-large"
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
