import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/course.service';
import './Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Explore Our Courses</h1>
        <p>Discover and enroll in professional courses to enhance your skills</p>
      </div>

      <div className="courses-grid">
        {courses.length === 0 ? (
          <div className="no-courses">
            <p>No courses available at the moment</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-card card card-interactive">
              <div className="course-image">
                <div className="course-placeholder">
                  <span className="course-icon">📚</span>
                </div>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="course-sessions">
                    {course.sessions?.length || 0} sessions
                  </span>
                  <span className="course-level">
                    {course.level || 'All Levels'}
                  </span>
                </div>
                <Link to={`/courses/${course.id}`} className="btn btn-primary">
                  View Course
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Courses;
