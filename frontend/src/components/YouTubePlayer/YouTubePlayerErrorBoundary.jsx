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

  render() {
    if (this.state.hasError) {
      return (
        <div className="youtube-player-card">
          <div className="youtube-error-box">
            <AlertTriangle size={32} className="error-icon" />
            <p className="error-title">Erreur de chargement du lecteur vidéo</p>
            <p className="error-subtitle">Une erreur s'est produite lors du chargement de la vidéo.</p>
            <div className="youtube-actions-bar">
              <button
                type="button"
                className="btn btn-primary action-btn"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                <RotateCw size={16} /> Réessayer
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default YouTubePlayerErrorBoundary;
