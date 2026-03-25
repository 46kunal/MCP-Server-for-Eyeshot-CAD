import React, { useState } from 'react';
import { Layers, ChevronRight, ChevronDown, Box, Circle, Triangle, Send } from 'lucide-react';

function ObjectTree({ modelState }) {
  const [expanded, setExpanded] = useState(true);
  const shapeType = modelState?.shapeType || 'box';
  const dims = modelState?.dimensions || {};

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header">
        <Layers size={12} /> Object Tree
      </div>
      <div className="panel-body" style={{ fontSize: '12px' }}>
        <div
          onClick={() => setExpanded(!expanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', cursor: 'pointer', borderRadius: '3px', background: 'var(--bg-active)' }}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <Box size={12} color="var(--accent)" />
          <span style={{ color: 'var(--text-bright)' }}>Scene</span>
        </div>
        {expanded && (
          <div style={{ paddingLeft: '20px', marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 6px', borderRadius: '3px', background: 'var(--accent)', color: '#fff' }}>
              {shapeType === 'sphere' ? <Circle size={11} /> : shapeType === 'cone' ? <Triangle size={11} /> : <Box size={11} />}
              <span style={{ fontSize: '11px' }}>{shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} 1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyRow({ propKey, value, onSave }) {
  const [val, setVal] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => { setVal(value); }, [value]);

  const commit = () => {
    setIsEditing(false);
    if (String(val) !== String(value)) {
      onSave(propKey, val);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'capitalize' }}>{propKey}</span>
      {isEditing ? (
        <input 
          autoFocus
          className="mono"
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={e => e.key === 'Enter' && commit()}
          style={{ 
            width: '60px', background: 'var(--bg-active)', border: '1px solid var(--accent)', 
            color: 'var(--text-bright)', textAlign: 'right', outline: 'none', fontSize: '11px', padding: '0 2px'
          }} 
        />
      ) : (
        <span 
          className="mono" 
          onClick={() => setIsEditing(true)}
          style={{ fontSize: '11px', color: 'var(--text-bright)', cursor: 'text', borderBottom: '1px dashed #555' }}
          title="Click to edit"
        >
          {val}
        </span>
      )}
    </div>
  );
}

function PropertiesPanel({ modelState, onPropertyEdit }) {
  const dims = modelState?.dimensions || {};
  const shapeType = modelState?.shapeType || 'box';

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header">Properties</div>
      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Type</span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--accent)' }}>{shapeType}</span>
        </div>
        
        {Object.entries(dims).map(([key, val]) => (
          <PropertyRow key={key} propKey={key} value={val} onSave={onPropertyEdit} />
        ))}

        {modelState?.volume && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Volume</span>
            <span className="mono" style={{ fontSize: '11px', color: '#4ec94e' }}>{modelState.volume}</span>
          </div>
        )}

        {modelState?.color && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Color</span>
            <span className="mono" style={{ fontSize: '11px', color: modelState.color }}>{modelState.color}</span>
          </div>
        )}

        {modelState?.objectId && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>ID</span>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{modelState.objectId}</span>
          </div>
        )}

        {Object.keys(dims).length === 0 && !modelState?.volume && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No properties</span>
        )}
      </div>
    </div>
  );
}

function CommandInput({ onSendCommand, isProcessing }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSendCommand(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <Send size={12} /> Command
      </div>
      <div className="panel-body">
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '4px' }}>
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter command..."
            disabled={isProcessing}
            style={{
              flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)',
              borderRadius: '3px', padding: '5px 8px', color: 'var(--text)',
              fontSize: '12px', outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            type="submit"
            disabled={isProcessing || !prompt.trim()}
            style={{
              background: 'var(--accent)', border: 'none', borderRadius: '3px',
              color: '#fff', padding: '0 10px', fontSize: '11px',
              opacity: isProcessing || !prompt.trim() ? 0.5 : 1
            }}
          >
            {isProcessing ? '...' : 'Run'}
          </button>
        </form>
      </div>
    </div>
  );
}

function CommandHistory({ history }) {
  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-header">Output</div>
      <div className="panel-body" style={{ maxHeight: '160px', overflowY: 'auto', fontSize: '11px' }}>
        {history.length === 0 ? (
          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No output yet.</span>
        ) : (
          [...history].reverse().map((cmd, i) => (
            <div key={i} style={{
              padding: '4px 6px', marginBottom: '4px',
              borderLeft: `2px solid ${cmd.status === 'success' ? 'var(--success)' : cmd.status === 'error' ? 'var(--error)' : 'var(--border)'}`,
              background: 'var(--bg-input)', borderRadius: '0 3px 3px 0'
            }}>
              <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{cmd.timestamp}</div>
              <div style={{ color: 'var(--text)' }}>{'> '}{cmd.prompt}</div>
              {cmd.response && (
                <div style={{ color: cmd.status === 'success' ? 'var(--success)' : 'var(--error)', marginTop: '2px' }}>
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

export default function Sidebar({ modelState, onSendCommand, onPropertyEdit, isProcessing, history }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', width: '240px', flexShrink: 0 }}>
      <ObjectTree modelState={modelState} />
      <PropertiesPanel modelState={modelState} onPropertyEdit={onPropertyEdit} />
      <CommandInput onSendCommand={onSendCommand} isProcessing={isProcessing} />
      <CommandHistory history={history} />
    </div>
  );
}
