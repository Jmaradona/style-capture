import React from 'react';
import Sheet from '../Sheet';
import { Cam, ImageIcon } from '../icons';

export default function AddImgSheet({ onCamera, onRoll, onClose }) {
  return (
    <Sheet title="Add Photo" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => { onCamera(); onClose(); }} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px',
          borderRadius: 14, background: 'var(--muted)', textAlign: 'left',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: '#EDE9FD',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
          }}><Cam /></div>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)' }}>Take Photo</span>
        </button>
        <button onClick={() => { onRoll(); onClose(); }} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px',
          borderRadius: 14, background: 'var(--muted)', textAlign: 'left',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: '#F0FAF0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34C759',
          }}><ImageIcon /></div>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)' }}>Camera Roll</span>
        </button>
      </div>
    </Sheet>
  );
}
