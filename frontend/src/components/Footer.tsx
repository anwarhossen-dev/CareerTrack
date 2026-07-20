import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          &copy; {currentYear} <strong>CareerTrack Lite</strong>. All rights reserved.
        </div>
        <div className="footer-developer">
          Developed by: <span style={{ color: 'var(--primary)' }}>MD. Anwar hossen</span> 
          <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span> 
          Student ID: <span style={{ color: 'var(--secondary)' }}>22-48211-3</span>
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>
          Build a deployable job application tracker in 3 days
        </div>
      </div>
    </footer>
  );
};

export default Footer;
