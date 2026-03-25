import React from 'react';
import { Activity, Box, History } from 'lucide-react';

export function SystemStatus({ isProcessing, statusMessage }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity size={14} color="var(--text-muted)" />
        <span className="label" style={{ margin: 0 }}>System Status</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        background: isProcessing ? '#fef3c7' : '#f0fdf4',
        borderRadius: '8px',
        borderLeft: `3px solid ${isProcessing ? 'var(--warning)' : 'var(--success)'}`
      }}>
        <span className="mono" style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: isProcessing ? 'var(--warning)' : 'var(--success)',
          textTransform: 'uppercase'
        }}>
          {isProcessing ? 'Processing' : 'Idle'}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {statusMessage || 'Awaiting command.'}
        </span>
      </div>
    </div>
  );
}

export function ModelInfo({ modelState }) {
  const dimensions = modelState?.dimensions || {};
  const shapeType = modelState?.shapeType || 'box';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Box size={14} color="var(--text-muted)" />
        <span className="label" style={{ margin: 0 }}>Model Info</span>
      </div>
      
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        background: 'var(--accent-light)',
        borderRadius: '6px',
        width: 'fit-content'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
          Shape: {shapeType}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {Object.entries(dimensions).length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No dimensions set.
          </div>
        ) : (
          Object.entries(dimensions).map(([key, value]) => (
            <div key={key} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 10px',
              background: 'var(--bg)',
              borderRadius: '6px'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'capitalize' }}>{key}</span>
              <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>{value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function CommandHistory({ history }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <History size={14} color="var(--text-muted)" />
        <span className="label" style={{ margin: 0 }}>Command Log</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1, maxHeight: '200px' }}>
        {history.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No commands yet.
          </div>
        ) : (
          [...history].reverse().map((cmd, i) => (
            <div key={i} style={{
              padding: '8px 10px',
              fontSize: '0.8rem',
              borderLeft: `3px solid ${cmd.status === 'success' ? 'var(--success)' : cmd.status === 'error' ? 'var(--error)' : 'var(--border)'}`,
              background: 'var(--bg)',
              borderRadius: '0 6px 6px 0'
            }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '2px', fontSize: '0.7rem' }} className="mono">
                {cmd.timestamp}
              </div>
              <div style={{ color: 'var(--text)' }}>{cmd.prompt}</div>
              {cmd.response && (
                <div style={{
                  color: cmd.status === 'success' ? 'var(--success)' : 'var(--error)',
                  marginTop: '4px',
                  fontSize: '0.75rem'
                }}>
                  {cmd.response}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
