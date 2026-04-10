import React from 'react';
import { Grid, Cam, Folder } from './icons';

const tabs = [
  { id: 'gallery', lb: 'Gallery', I: Grid },
  { id: 'camera', lb: '', I: Cam },
  { id: 'cols', lb: 'Collections', I: Folder },
];

export default function Nav({ tab, onTab }) {
  return (
    <nav className="nv">
      {tabs.map(({ id, lb, I }) => {
        const a = tab === id;
        const c = id === 'camera';
        return (
          <button key={id} onClick={() => onTab(id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: a && !c ? 'var(--primary)' : 'var(--mfg)',
          }}>
            {c ? (
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(87,39,230,.4)', marginTop: -32,
              }}>
                <I />
              </div>
            ) : (
              <>
                <I />
                <span style={{ fontSize: 10, fontWeight: a ? 600 : 400, letterSpacing: 0.1 }}>{lb}</span>
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}
