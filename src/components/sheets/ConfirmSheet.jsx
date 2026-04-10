import React from 'react';
import Sheet from '../Sheet';

export default function ConfirmSheet({ name, onConfirm, onClose }) {
  return (
    <Sheet title="Delete Collection" onClose={onClose}>
      <p style={{ fontSize: 14, color: 'var(--mfg)', marginBottom: 16, lineHeight: 1.5 }}>
        Delete <strong style={{ color: 'var(--fg)' }}>{name}</strong>? This cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{
          flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600,
          background: 'var(--muted)', color: 'var(--fg)',
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600,
          background: 'var(--red)', color: 'white',
        }}>Delete</button>
      </div>
    </Sheet>
  );
}
