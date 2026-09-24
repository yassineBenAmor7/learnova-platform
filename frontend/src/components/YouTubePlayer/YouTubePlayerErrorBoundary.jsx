import { Component } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

class YouTubePlayerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('YouTubePlayer Error Boundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Reset error state automatically if the video ID or target changes
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="youtube-player-card">
          <div className="youtube-error-box">
            <AlertTriangle size={32} className="error-icon" />
            <p className="error-title">Video Player Display Error</p>
            <p className="error-subtitle">A technical error occurred in the video playback component.</p>
            <div className="youtube-actions-bar">
              <button
                type="button"
                className="btn btn-primary action-btn"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                <RotateCw size={16} /> Reload Video
              </button>
              {this.props.onVideoEnded && (
                <button
                  type="button"
                  className="btn btn-secondary action-btn"
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    this.props.onVideoEnded();
                  }}
                >
                  Proceed to next chapter
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default YouTubePlayerErrorBoundary;
