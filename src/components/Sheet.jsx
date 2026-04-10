import React from 'react';
import { X } from './icons';

export default function Sheet({ title, onClose, children }) {
  return (
    <div className="fi" onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.4)' }}>
      <div className="su" onClick={(e) => e.stopPropagation()} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, margin: '0 auto',
        width: '100%', maxWidth: 430, background: 'white', borderRadius: '18px 18px 0 0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#d4d4d4' }} />
        </div>
        <div style={{
          padding: '4px 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)' }}>{title}</span>
          <button onClick={onClose} style={{ color: 'var(--mfg)', padding: 4 }}><X /></button>
        </div>
        <div style={{ padding: '0 18px', paddingBottom: 'calc(36px + var(--safe-b))' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
