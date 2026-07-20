import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" style={{ padding: '20px 0', borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface)', width: '100%', marginTop: 'auto', zIndex: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <div>
          &copy; {currentYear} <strong>CareerTrack Lite</strong>. All rights reserved.
        </div>
        <div>
          Developed by: <strong>MD. Anwar hossen</strong> | Student ID: <strong style={{ color: 'var(--primary)' }}>22-48211-3</strong>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
