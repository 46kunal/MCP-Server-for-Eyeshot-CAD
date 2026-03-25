import React, { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="card" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      borderRadius: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: 'var(--success)',
          boxShadow: '0 0 6px var(--success)'
        }} />
        <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
          MCP-CAD
        </h1>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Terminal
        </span>
      </div>
      <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {time}
      </div>
    </header>
  );
}
