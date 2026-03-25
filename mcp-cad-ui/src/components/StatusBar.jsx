import React from 'react';

export default function StatusBar({ coords, isProcessing, statusMessage }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-toolbar)',
      borderTop: '1px solid var(--border)',
      padding: '0 12px',
      height: '24px',
      fontSize: '11px',
      flexShrink: 0,
      userSelect: 'none'
    }}>
      {/* Left: Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: isProcessing ? 'var(--warning)' : 'var(--success)'
          }} />
          <span style={{ color: 'var(--text-muted)' }}>
            {isProcessing ? 'Processing...' : 'Ready'}
          </span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>
          {statusMessage}
        </span>
      </div>

      {/* Right: Coordinates */}
      <div className="mono" style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
        <span>X: <span style={{ color: '#f14c4c' }}>{coords.x.toFixed(2)}</span></span>
        <span>Y: <span style={{ color: '#4ec94e' }}>{coords.y.toFixed(2)}</span></span>
        <span>Z: <span style={{ color: '#6c9ef8' }}>{coords.z.toFixed(2)}</span></span>
      </div>
    </div>
  );
}
