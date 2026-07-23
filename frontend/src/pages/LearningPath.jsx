import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { learningPathService } from '../services/learningPath.service';
import Sidebar from '../components/Sidebar/Sidebar';
import { Award, CheckCircle, HelpCircle, Clock } from 'lucide-react';
import './LearningPath.css';

function LearningPath() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pathData, setPathData] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLearningPath();
  }, [id]);

  const loadLearningPath = async () => {
    try {
      setLoading(true);
      const data = await learningPathService.getCoursePath(id);
      setPathData(data);

      if (data.sessions && data.sessions.length > 0) {
        const firstAccessible = data.sessions.find(s => s.canAccess || !s.isLocked) || data.sessions[0];
        setCurrentSessionId(firstAccessible.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load learning path');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      await learningPathService.completeSession(sessionId);
      await loadLearningPath();
    } catch (err) {
      alert(err.message || 'Error completing session');
    }
  };

  const currentSession = pathData?.sessions?.find(s => s.id === currentSessionId);
  const progressPercentage = Math.round(pathData?.enrollment?.progress?.percentage || 0);
  const courseTitle = pathData?.enrollment?.course?.title || 'Course';
  const quizzes = pathData?.quizzes || pathData?.enrollment?.course?.quizzes || [];

  if (loading) {
    return (
      <div className="learning-path-container">
        <div className="loading">Loading learning path...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-path-container" style={{ padding: '2rem' }}>
        <div className="alert alert-danger">{error}</div>
        <Link to="/courses" className="btn btn-secondary">Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="learning-path-container">
      <Sidebar 
        sessions={pathData?.sessions || []}
        activeSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
      />
      
      <div className="learning-path-content">
        <div className="learning-path-header">
          <Link to="/courses" className="back-link">
            ← Back to courses
          </Link>
          <h1 className="course-title">{courseTitle}</h1>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">{progressPercentage}% Complete</span>
          </div>
        </div>

        {currentSession ? (
          <div className="session-content">
            <h2 className="session-title">{currentSession.title}</h2>
            <p className="session-description">{currentSession.description || 'No description available for this session.'}</p>
            
            {currentSession.videos && currentSession.videos.length > 0 && (
              <div className="videos-section">
                <h3>Session Videos</h3>
                <div className="videos-list">
                  {currentSession.videos.map((video) => (
                    <div key={video.id} className="video-item card">
                      <h4 className="video-title">{video.title}</h4>
                      {video.url && (
                        <div className="video-wrapper" style={{ margin: '1rem 0' }}>
                          <iframe
                            src={video.url.replace('watch?v=', 'embed/')}
                            title={video.title}
                            width="100%"
                            height="315"
                            frameBorder="0"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="session-actions" style={{ marginTop: '2rem' }}>
              {currentSession.isCompleted ? (
                <div className="tag tag-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                  <CheckCircle size={18} /> Session Completed
                </div>
              ) : (
                <button
                  onClick={() => handleCompleteSession(currentSession.id)}
                  className="btn btn-primary"
                >
                  Mark session as complete (+10 XP)
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="no-session">
            <p>Select a session from the sidebar to begin.</p>
          </div>
        )}

        {/* Section Quiz / Examens */}
        {quizzes && quizzes.length > 0 && (
          <div className="quiz-section card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} /> Evaluations & Exams
            </h3>
            {!pathData?.quizUnlocked && (
              <p className="alert alert-warning" style={{ margin: '1rem 0' }}>
                Complete all sessions to unlock quizzes and the final exam!
              </p>
            )}
            <div className="quiz-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {quizzes.map((quiz) => (
                <div key={quiz.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {quiz.isExamMode ? <Clock size={16} color="#e11d48" /> : <HelpCircle size={16} color="#2563eb" />}
                      {quiz.title}
                    </h4>
                    <small style={{ color: '#64748b' }}>
                      {quiz.isExamMode ? `Timed Exam (${quiz.timeLimitMinutes || 30} mins)` : 'Practice Quiz'}
                    </small>
                  </div>
                  <button
                    disabled={!pathData?.quizUnlocked}
                    onClick={() => navigate(quiz.isExamMode ? `/exam/${quiz.id}` : `/quiz/${quiz.id}`)}
                    className={`btn ${quiz.isExamMode ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  >
                    {quiz.isExamMode ? 'Take Exam' : 'Start Quiz'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningPath;

