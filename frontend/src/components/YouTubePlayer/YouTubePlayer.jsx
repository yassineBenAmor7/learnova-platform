import { useState, useEffect, useCallback, useRef } from 'react';
import { ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import YouTubePlayerErrorBoundary from './YouTubePlayerErrorBoundary';
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

function YouTubePlayerInner({ video, onVideoEnded }) {
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const iframeRef = useRef(null);

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

  // Handshake with YouTube iframe via postMessage to subscribe to events
  const sendListeningHandshake = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'listening', id: videoId }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }),
          '*'
        );
      } catch (e) {
        // Cross-origin safety
      }
    }
  }, [videoId]);

  // Send handshake on mount and shortly after to ensure YouTube iframe receives it
  useEffect(() => {
    if (!videoId) return;
    sendListeningHandshake();
    const t1 = setTimeout(sendListeningHandshake, 800);
    const t2 = setTimeout(sendListeningHandshake, 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [videoId, sendListeningHandshake]);

  // PostMessage listener for YouTube events (no direct DOM mutation, 100% React compatible)
  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.origin &&
        !event.origin.includes('youtube.com') &&
        !event.origin.includes('youtube-nocookie.com')
      ) {
        return;
      }

      try {
        let data = event.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }

        if (!data || typeof data !== 'object') return;

        // State 0 is ENDED in YouTube Player API
        const isEnded =
          (data.event === 'onStateChange' && (data.info === 0 || data.info === '0')) ||
          (data.info?.playerState === 0 || data.info?.playerState === '0') ||
          (data.event === 'infoDelivery' && (data.info?.playerState === 0 || data.info?.playerState === '0'));

        if (isEnded) {
          console.log('YouTube video ended event detected automatically via postMessage');
          handleMarkCompleted();
          return;
        }

        // Also check if playback position reached duration
        const currentTime = Number(data.info?.currentTime);
        const duration = Number(data.info?.duration);
        if (!isNaN(currentTime) && !isNaN(duration) && duration > 0) {
          if (currentTime >= duration - 1.5) {
            console.log('YouTube video completion detected via playback position');
            handleMarkCompleted();
          }
        }
      } catch (e) {
        // Non-JSON message, safely ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMarkCompleted]);

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

  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(origin)}&rel=0&modestbranding=1&playsinline=1`;

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
            ref={iframeRef}
            id={`yt-iframe-${videoId}`}
            className="youtube-embedded-iframe"
            src={embedUrl}
            title={video?.title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={sendListeningHandshake}
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
          {isCompleted ? (
            <span className="youtube-aux-completed-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
              <CheckCircle size={15} /> Leçon validée
            </span>
          ) : (
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

function YouTubePlayer(props) {
  const videoId = extractVideoId(props.video?.url);
  return (
    <YouTubePlayerErrorBoundary resetKey={videoId} onVideoEnded={props.onVideoEnded}>
      <YouTubePlayerInner {...props} />
    </YouTubePlayerErrorBoundary>
  );
}

export default YouTubePlayer;
