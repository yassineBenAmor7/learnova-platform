import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import './YouTubePlayer.css';

// Extract clean YouTube video ID
export const extractVideoId = (url) => {
  if (!url) return null;
  const cleanUrl = url.trim();
  const patterns = [
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) return match[1];
    if (match && match[0] && match[0].length === 11) return match[0];
  }
  return null;
};

function YouTubePlayer({ video, onVideoEnded }) {
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const id = extractVideoId(video?.url);
    setVideoId(id);
    setError(null);
    setIsCompleted(!!video?.isCompleted);
  }, [video?.url, video?.isCompleted]);

  const handleMarkCompleted = useCallback(() => {
    setIsCompleted(true);
    if (onVideoEnded) {
      onVideoEnded();
    }
  }, [onVideoEnded]);

  const watchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : video?.url || '#';

  if (!videoId) {
    return (
      <div className="youtube-player-card">
        <div className="youtube-error-box">
          <AlertTriangle size={32} className="error-icon" />
          <p className="error-title">URL de vidéo invalide ou manquante</p>
          <p className="error-url">{video?.url || 'Aucune URL spécifiée'}</p>
          <div className="youtube-actions-bar">
            <button
              type="button"
              className="btn btn-secondary action-btn"
              onClick={handleMarkCompleted}
            >
              <CheckCircle size={16} /> Marquer comme visionné
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="youtube-player-card">
      <div className="youtube-aspect-container">
        {error ? (
          <div className="youtube-error-box">
            <AlertTriangle size={32} className="error-icon" />
            <p className="error-title">Impossible de lire la vidéo directement ici</p>
            <p className="error-subtitle">{error}</p>
            <div className="youtube-actions-bar">
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary action-btn"
              >
                <ExternalLink size={16} /> Ouvrir sur YouTube
              </a>
              <button
                type="button"
                className="btn btn-success action-btn"
                onClick={handleMarkCompleted}
              >
                <CheckCircle size={16} /> Valider la leçon
              </button>
            </div>
          </div>
        ) : (
          <iframe
            key={videoId}
            className="youtube-embedded-iframe"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
            title={video?.title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>

      {/* Auxiliary bar with quick actions */}
      <div className="youtube-aux-bar">
        <span className="youtube-badge">
          Lecteur Haute Définition
        </span>
        <div className="youtube-aux-actions">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="youtube-aux-link"
            title="Visionner directement sur YouTube dans un nouvel onglet"
          >
            <ExternalLink size={14} /> Voir sur YouTube
          </a>
          {!isCompleted && (
            <button
              type="button"
              className="youtube-aux-complete-btn"
              onClick={handleMarkCompleted}
              title="Marquer comme terminée pour avancer dans le chapitre"
            >
              <CheckCircle size={14} /> Marquer comme terminée
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default YouTubePlayer;
