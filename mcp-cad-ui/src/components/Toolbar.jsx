import React from 'react';
import { Box, Move, Maximize2, Circle, Triangle, Type, MousePointer, Grid3x3 } from 'lucide-react';

const tools = [
  { icon: MousePointer, label: 'Select', id: 'select' },
  { icon: Box, label: 'Box', id: 'box' },
  { icon: Circle, label: 'Sphere', id: 'sphere' },
  { icon: Triangle, label: 'Cone', id: 'cone' },
  { icon: Grid3x3, label: 'Cylinder', id: 'cylinder' },
  { icon: Maximize2, label: 'Extrude', id: 'extrude' },
  { icon: Move, label: 'Move', id: 'move' },
  { icon: Type, label: 'Measure', id: 'measure' },
];

export default function Toolbar({ activeTool, onToolSelect }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1px',
      background: 'var(--bg-toolbar)',
      borderBottom: '1px solid var(--border)',
      padding: '0 8px',
      height: '36px',
      flexShrink: 0
    }}>
      {/* App title */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        paddingRight: '16px', borderRight: '1px solid var(--border)', marginRight: '8px'
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
        <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-bright)' }}>MCP-CAD</span>
      </div>

      {/* Tool buttons */}
      {tools.map(tool => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            title={tool.label}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 8px', height: '28px',
              background: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text)',
              border: 'none', borderRadius: '3px',
              fontSize: '11px', transition: 'background 0.15s'
            }}
            onMouseEnter={e => { if (!isActive) e.target.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { if (!isActive) e.target.style.background = 'transparent'; }}
          >
            <Icon size={14} />
            <span>{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
}
