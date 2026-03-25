import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function CommandPanel({ onSendCommand, isProcessing }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSendCommand(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="label">Command Input</div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Create a sphere with radius 3"
          disabled={isProcessing}
          style={{
            flex: 1,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.9rem',
            color: 'var(--text)',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          type="submit"
          disabled={isProcessing || !prompt.trim()}
          style={{
            background: isProcessing ? 'var(--bg)' : 'var(--accent)',
            border: 'none',
            borderRadius: '8px',
            color: isProcessing ? 'var(--text-muted)' : 'white',
            padding: '0 16px',
            cursor: isProcessing || !prompt.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
        >
          {isProcessing ? '...' : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}
