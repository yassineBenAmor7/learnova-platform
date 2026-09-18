import { Lock, CheckCircle, Play, Clock, ChevronRight, ChevronDown, HelpCircle } from 'lucide-react';
import './Sidebar.css';
import { useState } from 'react';

const Sidebar = ({
  sessions,
  activeSessionId,
  activeVideoId,
  onSessionSelect,
  onVideoSelect,
  onSessionLockedClick,
  onVideoLockedClick,
  quizzes,
}) => {
  const [expandedSessions, setExpandedSessions] = useState(new Set([activeSessionId]));

  const toggleSession = (sessionId) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  // Calculate estimated duration for each session
  const getSessionDuration = (session) => {
    if (!session.videos || session.videos.length === 0) return null;
    
    const totalSeconds = session.videos.reduce((sum, video) => {
      return sum + (video.duration || 0);
    }, 0);
    
    const totalMinutes = Math.round(totalSeconds / 60);
    
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  // Find practice quiz for a session
  const getSessionQuiz = (sessionId) => {
    return quizzes?.find(q => q.sessionId === sessionId && !q.isExamMode);
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Learning Path</h3>
      </div>
      <div className="sidebar-sessions">
        {sessions.map((session, index) => {
          const isActive = session.id === activeSessionId;
          const isCompleted = session.isCompleted;
          const isLocked = session.isLocked;
          const isExpanded = expandedSessions.has(session.id);
          const sessionDuration = getSessionDuration(session);

          let statusClass = 'session-unlocked';
          let StatusIcon = Play;

          if (isCompleted) {
            statusClass = 'session-completed';
            StatusIcon = CheckCircle;
          } else if (isLocked) {
            statusClass = 'session-locked';
            StatusIcon = Lock;
          } else if (isActive) {
            statusClass = 'session-active';
          }

          return (
            <div key={session.id} className="session-wrapper">
              <div
                className={`session-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                onClick={() => {
                  if (!isLocked) {
                    toggleSession(session.id);
                    onSessionSelect(session.id);
                  } else if (onSessionLockedClick) {
                    onSessionLockedClick(session, index);
                  }
                }}
              >
                <div className={`session-status-indicator ${statusClass}`}>
                  {isCompleted ? (
                    <CheckCircle size={14} />
                  ) : isLocked ? (
                    <Lock size={14} />
                  ) : sessions.length > 1 ? (
                    <span className="session-badge-number">{index + 1}</span>
                  ) : (
                    <Play size={12} />
                  )}
                </div>
                <div className="session-info">
                  <span className="session-title-text">
                    {sessions.length === 1 ? session.title.replace(/^Session\s*1\s*[:\-]\s*/i, 'Session: ') : session.title}
                  </span>
                  {sessionDuration && (
                    <div className="session-duration">
                      <Clock size={12} />
                      <span>{sessionDuration}</span>
                    </div>
                  )}
                </div>
                <div className="session-chevron">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </div>
              
              {isExpanded && session.videos && session.videos.length > 0 && (
                <div className="session-chapters">
                  {session.videos.map((video, vIdx) => {
                    const isVideoActive = video.id === activeVideoId;
                    const isVideoDone = video.isCompleted;
                    const isPriorIncomplete = vIdx > 0 && session.videos.slice(0, vIdx).some((v) => !v.isCompleted);
                    const isVideoLocked = isLocked || isPriorIncomplete;
                    
                    return (
                      <div
                        key={video.id}
                        className={`chapter-item ${isVideoActive ? 'active' : ''} ${isVideoLocked ? 'locked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isVideoLocked && onVideoSelect) {
                            onVideoSelect(video.id);
                          } else if (isVideoLocked && onVideoLockedClick) {
                            onVideoLockedClick(video, vIdx);
                          }
                        }}
                      >
                        <span className="chapter-number">{vIdx + 1}</span>
                        <span className="chapter-title">{video.title}</span>
                        {isVideoDone ? (
                          <CheckCircle size={12} style={{ color: '#10b981', marginLeft: 'auto', flexShrink: 0 }} />
                        ) : isVideoLocked ? (
                          <Lock size={12} style={{ color: '#94a3b8', marginLeft: 'auto', flexShrink: 0 }} />
                        ) : video.duration ? (
                          <span className="chapter-duration">
                            {Math.round(video.duration / 60)} min
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
