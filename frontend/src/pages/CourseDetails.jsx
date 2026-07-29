import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Award, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { courseService } from '../services/course.service';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const courseData = await courseService.getById(id);
        setCourse(courseData);
        
        // Check if user is enrolled
        try {
          const enrollments = await courseService.getMyEnrollments();
          const isEnrolled = enrollments.some(e => e.courseId === parseInt(id));
          setEnrolled(isEnrolled);
        } catch (enrollError) {
          console.error('Error checking enrollment:', enrollError);
        }
      } catch (error) {
        setError('Failed to load course details');
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await courseService.enroll(id);
      setEnrolled(true);
      navigate('/learning-path/' + id);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  const handleStartLearning = () => {
    navigate('/learning-path/' + id);
  };

  if (loading) {
    return (
      <div className="course-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/courses')} className="btn-back">
          Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-details-error">
        <h2>Course not found</h2>
        <button onClick={() => navigate('/courses')} className="btn-back">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="course-details-container">
      <div className="course-header">
        <div className="course-header-content">
          <div className="course-breadcrumb">
            <span onClick={() => navigate('/courses')}>Courses</span>
            <span className="separator">/</span>
            <span className="current">{course.title}</span>
          </div>
          
          <h1 className="course-title">{course.title}</h1>
          <p className="course-description">{course.description}</p>
          
          <div className="course-meta">
            <div className="meta-item">
              <BookOpen size={20} />
              <span>{course.creator?.firstName} {course.creator?.lastName}</span>
            </div>
            <div className="meta-item">
              <Clock size={20} />
              <span>{course.sessions?.length || 0} sessions</span>
            </div>
            <div className="meta-item">
              <Award size={20} />
              <span>Includes Certificate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="course-main">
          <div className="course-section">
            <h2 className="section-title">About This Course</h2>
            <p className="section-text">
              {course.description}
            </p>
          </div>

          <div className="course-section">
            <h2 className="section-title">Course Content</h2>
            <div className="sessions-list">
              {course.sessions && course.sessions.length > 0 ? (
                course.sessions
                  .sort((a, b) => a.orderNumber - b.orderNumber)
                  .map((session, index) => (
                    <div key={session.id} className="session-item">
                      <div className="session-number">
                        <PlayCircle size={24} className="play-icon" />
                      </div>
                      <div className="session-info">
                        <h3 className="session-title">Session {index + 1}: {session.title}</h3>
                        <p className="session-duration">
                          <Clock size={16} />
                          {session.videos?.length || 0} videos
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p>No sessions available yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="course-sidebar">
          <div className="course-card">
            {course.thumbnail && (
              <div className="course-preview">
                <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
              </div>
            )}
            
            <div className="course-info">
              <div className="info-row">
                <span className="label">Sessions</span>
                <span className="value">{course.sessions?.length || 0}</span>
              </div>
              <div className="info-row">
                <span className="label">Videos</span>
                <span className="value">{course.sessions?.reduce((acc, s) => acc + (s.videos?.length || 0), 0) || 0}</span>
              </div>
              <div className="info-row">
                <span className="label">Quiz</span>
                <span className="value">{course.quizzes?.length > 0 ? 'Included' : 'None'}</span>
              </div>
            </div>

            {enrolled ? (
              <button onClick={handleStartLearning} className="btn btn-primary btn-full">
                Continue Learning
              </button>
            ) : (
              <button onClick={handleEnroll} className="btn btn-primary btn-full">
                Enroll Now
              </button>
            )}

            <div className="course-features">
              <div className="feature-item">
                <CheckCircle size={18} />
                <span>Lifetime access</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={18} />
                <span>Certificate of completion</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={18} />
                <span>Structured learning path</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
