import { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ video, onProgressUpdate, onVideoEnded }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgressUpdate) {
        onProgressUpdate(video.currentTime, video.duration);
      }
      
      // Check if video reached completion (when user watches or seeks to end)
      if (video.duration > 0 && !video.hasAttribute('data-ended')) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        if (progressPercent >= 95 || (video.duration - video.currentTime) <= 2) {
          console.log('Video reached completion threshold, marking as completed');
          video.setAttribute('data-ended', 'true');
          if (onVideoEnded) {
            onVideoEnded();
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setVideoError(false);
    };

    const handleEnded = () => {
      console.log('Video ended event triggered');
      setIsPlaying(false);
      if (onVideoEnded && !video.hasAttribute('data-ended')) {
        console.log('Calling onVideoEnded callback');
        video.setAttribute('data-ended', 'true');
        onVideoEnded();
      }
    };

    const handleError = () => {
      setVideoError(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onProgressUpdate, onVideoEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = (e.target.value / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = e.target.value;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const videoSrc = video?.url?.startsWith('/uploads')
    ? `http://localhost:3000${video.url}`
    : video?.url || '';

  // Detect video type from URL
  const getVideoType = (url) => {
    if (!url) return 'video/mp4';
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'mp4':
        return 'video/mp4';
      case 'webm':
        return 'video/webm';
      case 'ogg':
        return 'video/ogg';
      default:
        return 'video/mp4';
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.removeAttribute('data-ended');
      setIsPlaying(false);
      setCurrentTime(0);
      setVideoError(false);
    }
  }, [video?.url]);

  if (!video) {
    return null;
  }

  if (videoError) {
    return (
      <div className="video-player video-error">
        <div className="error-message">
          <p>Unable to load video</p>
          <p className="error-url">{video.url}</p>
          <p className="error-hint">Please check if the URL is accessible and supports CORS</p>
          {onVideoEnded && (
            <button
              type="button"
              className="retry-button"
              onClick={onVideoEnded}
              style={{ marginTop: '1rem', background: '#10b981' }}
            >
              ✓ Mark as completed and continue
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="video-player">
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-element"
          poster={video.thumbnail || ''}
          crossOrigin="anonymous"
          controls
        >
          <source src={videoSrc} type={getVideoType(video?.url)} />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-controls">
        <div className="progress-bar">
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleSeek}
            className="progress-slider"
          />
        </div>

        <div className="controls-row">
          <button onClick={togglePlay} className="control-btn">
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span className="time-separator">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="volume-controls">
            <button onClick={toggleMute} className="control-btn">
              {isMuted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
