import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Learnova</h3>
          <p className="footer-description">
            Intelligent e-learning platform for modern education
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/courses">Courses</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/certificates">Certificates</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li><a href="/help">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Connect</h4>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">
              <span>𝕏</span>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <span>in</span>
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <span>⌘</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Learnova. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
