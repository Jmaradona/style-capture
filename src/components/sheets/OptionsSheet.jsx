import React from 'react';
import Sheet from '../Sheet';
import { Pencil, Trash } from '../icons';

export default function OptionsSheet({ col, onRename, onDelete, onClose }) {
  return (
    <Sheet title={col.name} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={onRename} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px',
          borderRadius: 14, background: 'var(--muted)', textAlign: 'left',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: '#E8F4FD',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)',
          }}><Pencil /></div>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--fg)' }}>Rename</span>
        </button>
        <button onClick={onDelete} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px',
          borderRadius: 14, background: 'var(--muted)', textAlign: 'left',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: '#FEECEC',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)',
          }}><Trash /></div>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--red)' }}>Delete</span>
        </button>
      </div>
    </Sheet>
  );
}
