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
            <p className="error-title">Erreur d'affichage du lecteur vidéo</p>
            <p className="error-subtitle">Un incident technique est survenu dans le composant vidéo.</p>
            <div className="youtube-actions-bar">
              <button
                type="button"
                className="btn btn-primary action-btn"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                <RotateCw size={16} /> Recharger la vidéo
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
                  Passer au chapitre suivant
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
