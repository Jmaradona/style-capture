import React, { useState, useRef, useEffect } from 'react';
import Sheet from '../Sheet';

export default function RenameSheet({ current, onSave, onClose }) {
  const [v, setV] = useState(current);
  const r = useRef();

  useEffect(() => { setTimeout(() => r.current?.focus(), 100); }, []);

  const go = () => { if (v.trim()) { onSave(v.trim()); onClose(); } };

  return (
    <Sheet title="Rename Collection" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input ref={r} value={v} onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          style={{
            width: '100%', padding: '13px 14px', borderRadius: 12, fontSize: 15,
            background: 'var(--muted)', color: 'var(--fg)',
          }} />
        <button onClick={go} style={{
          width: '100%', padding: 13, borderRadius: 12, fontSize: 15, fontWeight: 600,
          background: v.trim() ? 'var(--primary)' : 'var(--muted)',
          color: v.trim() ? 'white' : 'var(--mfg)', transition: 'all .15s',
        }}>Save</button>
      </div>
    </Sheet>
  );
}
