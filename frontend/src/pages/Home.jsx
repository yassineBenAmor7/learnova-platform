import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboard.service';
import './Home.css';

function Home() {
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState('');

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await dashboardService.getPublicOverview();
        setOverview(data);
      } catch (err) {
        setOverviewError(err.message || 'Impossible de charger les statistiques.');
      } finally {
        setLoadingOverview(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <main className="home-page page-wrapper">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">Learnova</span>
          <h1>Apprenez mieux. Avancez plus vite. Certifiez votre réussite.</h1>
          <p>
            Learnova est la plateforme d’apprentissage professionnelle qui réunit cours, quiz, suivi de progression et certificats officiels dans une interface moderne et intuitive.
          </p>
          <div className="home-actions">
            <Link to="/login" className="btn btn-primary">
              Se connecter
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Créer un compte
            </Link>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-card">
            <div className="hero-card-top">
              <span className="hero-badge">Tableau de bord</span>
              <span className="hero-status">Nouveauté</span>
            </div>
            <div className="hero-card-body">
              <div className="hero-metric">
                <strong>{loadingOverview ? '...' : overview?.totalCourses ?? '0'}</strong>
                <span>Courses disponibles</span>
              </div>
              <div className="hero-metric">
                <strong>{loadingOverview ? '...' : overview?.totalEnrollments ?? '0'}</strong>
                <span>Inscriptions totales</span>
              </div>
              <div className="hero-metric">
                <strong>{loadingOverview ? '...' : overview?.totalCertificates ?? '0'}</strong>
                <span>Certificats délivrés</span>
              </div>
            </div>
            <div className="hero-card-footer">
              {overviewError
                ? 'Statistiques disponibles pour le moment.'
                : 'Suivez vos progrès, accédez à vos cours et gagnez des certificats rapidement.'}
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <h2>Une expérience e-learning conçue pour l’excellence</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Parcours personnalisés</h3>
            <p>Des recommandations de cours adaptées à votre profil et à votre rythme d’apprentissage.</p>
          </article>
          <article className="feature-card">
            <h3>Progression visible</h3>
            <p>Visualisez vos progrès, vos compétences acquises et vos objectifs en un seul endroit.</p>
          </article>
          <article className="feature-card">
            <h3>Évaluations engageantes</h3>
            <p>Des quiz et examens interactifs qui valident vos connaissances et vous préparent au succès.</p>
          </article>
          <article className="feature-card">
            <h3>Certificats officiels</h3>
            <p>Recevez des certificats modernes et partageables pour valoriser votre réussite.</p>
          </article>
        </div>
      </section>

      <section className="home-cta-block">
        <div className="home-cta-card">
          <div>
            <h2>Commencez votre parcours Learnova dès maintenant</h2>
            <p>Rejoignez une expérience d’apprentissage fiable pensée pour les apprenants sérieux et les équipes performantes.</p>
          </div>
          <Link to="/register" className="btn btn-primary btn-large">
            Créer mon compte
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
