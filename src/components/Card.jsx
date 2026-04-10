import React from 'react';
import { Chk } from './icons';

export default function Card({ image, sel, selected, onPress }) {
  return (
    <div onClick={onPress} style={{
      position: 'relative', aspectRatio: '3/4', overflow: 'hidden', cursor: 'pointer',
      borderRadius: sel ? 6 : 10, background: 'var(--muted)',
      transform: selected ? 'scale(0.92)' : 'scale(1)',
      transition: 'transform .12s ease, border-radius .15s ease',
    }}>
      <img src={image.url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {sel && (
        <div style={{
          position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%',
          background: selected ? 'var(--blue)' : 'transparent',
          border: `2px solid ${selected ? 'var(--blue)' : 'rgba(255,255,255,.9)'}`,
          boxShadow: '0 1px 4px rgba(0,0,0,.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          transition: 'all .14s',
        }}>
          {selected && <Chk s={11} />}
        </div>
      )}
    </div>
  );
}
