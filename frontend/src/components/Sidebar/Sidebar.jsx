import { Lock, CheckCircle, Play } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ sessions, activeSessionId, onSessionSelect }) => {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Parcours d'Apprentissage</h3>
      </div>
      <div className="sidebar-sessions">
        {sessions.map((session, index) => {
          const isActive = session.id === activeSessionId;
          const isCompleted = session.isCompleted;
          const isLocked = session.isLocked;

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
            <div
              key={session.id}
              className={`session-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
              onClick={() => !isLocked && onSessionSelect(session.id)}
            >
              <div className={`session-status-indicator ${statusClass}`}>
                <StatusIcon size={16} />
              </div>
              <div className="session-info">
                <span className="session-number">Session {index + 1}</span>
                <span className="session-title-text">{session.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
