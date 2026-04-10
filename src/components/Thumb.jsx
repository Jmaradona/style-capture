import React from 'react';

export default function Thumb({ imgs: raw, sz = 42 }) {
  const imgs = raw.slice(0, 4);
  const r = Math.round(sz * 0.19);

  if (!imgs.length) {
    return <div style={{ width: sz, height: sz, borderRadius: r, background: 'var(--border)', flexShrink: 0 }} />;
  }

  if (imgs.length === 1) {
    return (
      <div style={{ width: sz, height: sz, borderRadius: r, overflow: 'hidden', flexShrink: 0 }}>
        <img src={imgs[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={{
      width: sz, height: sz, borderRadius: r, overflow: 'hidden', flexShrink: 0,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)',
    }}>
      {imgs.map((i) => (
        <img key={i.id} src={i.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ))}
    </div>
  );
}
