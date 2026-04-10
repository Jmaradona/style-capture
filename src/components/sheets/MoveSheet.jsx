import React from 'react';
import Sheet from '../Sheet';
import Thumb from '../Thumb';

export default function MoveSheet({ collections, currentId, count, onMove, onClose }) {
  const targets = collections.filter((c) => c.id !== currentId);

  return (
    <Sheet title={`Move ${count} image${count !== 1 ? 's' : ''} to\u2026`} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {targets.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '24px 0', fontSize: 14, color: 'var(--mfg)' }}>
            No other collections
          </p>
        ) : targets.map((c) => (
          <button key={c.id} onClick={() => onMove(c.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '10px 12px', borderRadius: 13, textAlign: 'left', background: 'var(--muted)',
          }}>
            <Thumb imgs={c.images} sz={42} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--mfg)', marginTop: 1 }}>{c.images.length} items</div>
            </div>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
