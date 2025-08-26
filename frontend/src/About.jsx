import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/About.css';

const About = () => {
  const navigate = useNavigate();
  const email = 'rishimeh101@gmail.com';
  const [copied, setCopied] = React.useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className="about-container">
      <div className="about-card">
        <div className="about-hero">
          <h1 className="about-title">About Bhookh</h1>
          <div className="about-subtitle">Reducing food waste. Feeding more people. Together.</div>
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>
              Bhookh connects food donors with people and organizations in need. Our mission is to make donating
              safe, simple, and fast while ensuring food reaches the right hands at the right time.
            </p>
            <p>
              Use the Donate page to share surplus food, or the Find page to locate nearby collection points and
              donations. Every small act contributes to a bigger impact.
            </p>
          </div>
          <div className="about-contact">
            <div className="contact-title">Contact the creator</div>
            <div className="contact-row">
              <span>✉️</span>
              <a className="mailto-link" href={`mailto:${email}`}>{email}</a>
            </div>
            <div className="contact-row">
              <button className="copy-button" onClick={copyEmail}>{copied ? 'Copied!' : 'Copy email'}</button>
            </div>
          </div>
        </div>
        <div className="about-footer">
          <button className="back-home" onClick={() => navigate('/')}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default About;


