import React, { useState, useRef, useEffect } from 'react';
import Sheet from '../Sheet';

export default function NewColSheet({ onAdd, onClose }) {
  const [n, setN] = useState('');
  const r = useRef();

  useEffect(() => { setTimeout(() => r.current?.focus(), 100); }, []);

  const go = () => { if (n.trim()) { onAdd(n.trim()); onClose(); } };

  return (
    <Sheet title="New Collection" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input ref={r} placeholder="Collection name\u2026" value={n}
          onChange={(e) => setN(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          style={{
            width: '100%', padding: '13px 14px', borderRadius: 12, fontSize: 15,
            background: 'var(--muted)', color: 'var(--fg)',
          }} />
        <button onClick={go} style={{
          width: '100%', padding: 13, borderRadius: 12, fontSize: 15, fontWeight: 600,
          background: n.trim() ? 'var(--primary)' : 'var(--muted)',
          color: n.trim() ? 'white' : 'var(--mfg)', transition: 'all .15s',
        }}>Create</button>
      </div>
    </Sheet>
  );
}
