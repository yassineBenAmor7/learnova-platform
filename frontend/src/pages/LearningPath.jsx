import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../services/course.service';
import { learningPathService } from '../services/learningPath.service';
import Sidebar from '../components/Sidebar/Sidebar';
import './LearningPath.css';

function LearningPath() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLearningPath();
  }, [id]);

  const loadLearningPath = async () => {
    try {
      setLoading(true);
      const [courseData, sessionsData, progressData] = await Promise.all([
        courseService.getById(id),
        learningPathService.getSessions(id),
        learningPathService.getProgress(id)
      ]);
      setCourse(courseData);
      setSessions(sessionsData);
      setProgress(progressData.progress || 0);
      
      // Set first unlocked session as current
      const firstUnlocked = sessionsData.find(s => !s.locked);
      if (firstUnlocked) {
        setCurrentSession(firstUnlocked);
      }
    } catch (err) {
      setError('Failed to load learning path');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = (session) => {
    if (!session.locked) {
      setCurrentSession(session);
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      await learningPathService.completeSession(sessionId);
      // Reload to update progress
      loadLearningPath();
    } catch (err) {
      setError('Failed to complete session');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="learning-path-container">
        <div className="loading">Loading learning path...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-path-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="learning-path-container">
        <div className="alert alert-warning">Course not found</div>
      </div>
    );
  }

  return (
    <div className="learning-path-container">
      <Sidebar 
        sessions={sessions}
        currentSession={currentSession}
        onSessionSelect={handleSessionSelect}
      />
      
      <div className="learning-path-content">
        <div className="learning-path-header">
          <Link to="/courses" className="back-link">
            ← Back to Courses
          </Link>
          <h1 className="course-title">{course.title}</h1>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress}% Complete</span>
          </div>
        </div>

        {currentSession ? (
          <div className="session-content">
            <h2 className="session-title">{currentSession.title}</h2>
            <p className="session-description">{currentSession.description}</p>
            
            {currentSession.videos && currentSession.videos.length > 0 && (
              <div className="videos-section">
                <h3>Session Videos</h3>
                <div className="videos-list">
                  {currentSession.videos.map((video) => (
                    <div key={video.id} className="video-item">
                      <h4 className="video-title">{video.title}</h4>
                      <p className="video-description">{video.description}</p>
                      <button className="btn btn-secondary">
                        Watch Video
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="session-actions">
              <button
                onClick={() => handleCompleteSession(currentSession.id)}
                className="btn btn-primary"
              >
                Mark as Complete
              </button>
            </div>
          </div>
        ) : (
          <div className="no-session">
            <p>Select a session from the sidebar to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningPath;
