import { useState, useEffect, useCallback, useRef } from 'react';
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

  // 1. PostMessage listener for YouTube state change to ENDED (state 0)
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        // State 0 is ENDED in YouTube Player API
        if (
          (data?.event === 'onStateChange' && data?.info === 0) ||
          (data?.info?.playerState === 0)
        ) {
          console.log('YouTube video ended event detected automatically via postMessage');
          handleMarkCompleted();
        }
      } catch (e) {
        // Non-JSON message, ignore safely
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMarkCompleted]);

  // 2. YouTube Iframe API listener
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let playerInstance = null;
    let isMounted = true;

    const setupPlayer = () => {
      if (!isMounted || !iframeRef.current || !window.YT || !window.YT.Player) return;
      try {
        playerInstance = new window.YT.Player(iframeRef.current, {
          events: {
            onStateChange: (event) => {
              if (event.data === 0) { // 0 = YT.PlayerState.ENDED
                console.log('YouTube video ended detected via YT.Player API');
                handleMarkCompleted();
              }
            },
          },
        });
      } catch (err) {
        // Fallback to postMessage listener
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        setupPlayer();
      };
    }

    return () => {
      isMounted = false;
      if (playerInstance && typeof playerInstance.destroy === 'function') {
        try { playerInstance.destroy(); } catch (e) {}
      }
    };
  }, [videoId, handleMarkCompleted]);

  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'listening', id: videoId }),
          '*'
        );
      } catch (e) {}
    }
  };

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
            ref={iframeRef}
            key={videoId}
            id={`yt-iframe-${videoId}`}
            className="youtube-embedded-iframe"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&rel=0&modestbranding=1&playsinline=1`}
            title={video?.title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleIframeLoad}
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

export default YouTubePlayer;
