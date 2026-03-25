import React from 'react';

export default function CoordinateDisplay({ coords }) {
  const x = coords.x.toFixed(2);
  const y = coords.y.toFixed(2);
  const z = coords.z.toFixed(2);

  return (
    <div className="card" style={{
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      zIndex: 20,
      minWidth: '140px',
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(8px)',
      pointerEvents: 'none'
    }}>
      <div className="label" style={{ fontSize: '0.65rem' }}>World Coordinates</div>
      <div className="mono" style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.85rem', fontWeight: 500 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: '#dc2626' }}>X</span>
          <span style={{ color: 'var(--text)' }}>{x}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: '#16a34a' }}>Y</span>
          <span style={{ color: 'var(--text)' }}>{y}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: '#2563eb' }}>Z</span>
          <span style={{ color: 'var(--text)' }}>{z}</span>
        </div>
      </div>
    </div>
  );
}
