import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Award, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    // Simulate fetching course data
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const courseData = {
          id: id,
          title: 'Advanced Web Development',
          description: 'Master modern web development with React, Node.js, and best practices. This comprehensive course covers everything from fundamentals to advanced concepts.',
          instructor: 'Dr. Sarah Johnson',
          duration: '12 weeks',
          students: 1234,
          rating: 4.8,
          level: 'Intermediate',
          category: 'Web Development',
          price: 99.99,
          image: '/course-placeholder.jpg',
          sessions: [
            { id: 1, title: 'Introduction to Modern Web Development', duration: '45 min', completed: true, locked: false },
            { id: 2, title: 'React Fundamentals', duration: '60 min', completed: true, locked: false },
            { id: 3, title: 'State Management with Redux', duration: '75 min', completed: false, locked: false },
            { id: 4, title: 'Building REST APIs with Node.js', duration: '90 min', completed: false, locked: true },
            { id: 5, title: 'Database Design and Integration', duration: '60 min', completed: false, locked: true },
            { id: 6, title: 'Authentication and Security', duration: '45 min', completed: false, locked: true },
            { id: 7, title: 'Testing and Debugging', duration: '50 min', completed: false, locked: true },
            { id: 8, title: 'Deployment and CI/CD', duration: '40 min', completed: false, locked: true },
          ]
        };
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = () => {
    // Implement enrollment logic
    setEnrolled(true);
    navigate('/learning-path/' + id);
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
            <span>{course.category}</span>
            <span className="separator">/</span>
            <span className="current">{course.title}</span>
          </div>
          
          <h1 className="course-title">{course.title}</h1>
          <p className="course-description">{course.description}</p>
          
          <div className="course-meta">
            <div className="meta-item">
              <BookOpen size={20} />
              <span>{course.instructor}</span>
            </div>
            <div className="meta-item">
              <Clock size={20} />
              <span>{course.duration}</span>
            </div>
            <div className="meta-item">
              <Users size={20} />
              <span>{course.students.toLocaleString()} students</span>
            </div>
            <div className="meta-item">
              <Award size={20} />
              <span>{course.rating} rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="course-main">
          <div className="course-section">
            <h2 className="section-title">About This Course</h2>
            <p className="section-text">
              {course.description} This course is designed for developers who want to take their skills to the next level. 
              You'll learn industry best practices, build real-world projects, and gain hands-on experience with modern tools and technologies.
            </p>
          </div>

          <div className="course-section">
            <h2 className="section-title">What You'll Learn</h2>
            <ul className="learning-outcomes">
              <li>Build modern web applications with React and Node.js</li>
              <li>Implement state management with Redux</li>
              <li>Design and integrate RESTful APIs</li>
              <li>Work with databases using Prisma ORM</li>
              <li>Implement authentication and security measures</li>
              <li>Write unit and integration tests</li>
              <li>Deploy applications using CI/CD pipelines</li>
            </ul>
          </div>

          <div className="course-section">
            <h2 className="section-title">Course Content</h2>
            <div className="sessions-list">
              {course.sessions.map((session, index) => (
                <div key={session.id} className={`session-item ${session.locked ? 'locked' : ''}`}>
                  <div className="session-number">
                    {session.completed ? (
                      <CheckCircle size={24} className="completed-icon" />
                    ) : session.locked ? (
                      <Lock size={24} className="locked-icon" />
                    ) : (
                      <PlayCircle size={24} className="play-icon" />
                    )}
                  </div>
                  <div className="session-info">
                    <h3 className="session-title">Session {index + 1}: {session.title}</h3>
                    <p className="session-duration">
                      <Clock size={16} />
                      {session.duration}
                    </p>
                  </div>
                  {session.locked && (
                    <div className="lock-badge">
                      <Lock size={16} />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="course-sidebar">
          <div className="course-card">
            <div className="course-preview">
              <div className="preview-placeholder">
                <PlayCircle size={48} />
                <span>Course Preview</span>
              </div>
            </div>
            
            <div className="course-info">
              <div className="info-row">
                <span className="label">Level</span>
                <span className="value">{course.level}</span>
              </div>
              <div className="info-row">
                <span className="label">Duration</span>
                <span className="value">{course.duration}</span>
              </div>
              <div className="info-row">
                <span className="label">Sessions</span>
                <span className="value">{course.sessions.length}</span>
              </div>
              <div className="info-row">
                <span className="label">Certificate</span>
                <span className="value">Included</span>
              </div>
            </div>

            <div className="course-price">
              <span className="price-label">Price</span>
              <span className="price-value">${course.price}</span>
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
                <span>Project-based learning</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={18} />
                <span>Instructor support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
