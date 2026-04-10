import React from 'react';
import { Send, Move } from './icons';
import { BRAND } from '../lib/brand';

export default function SelBar({ count, total, onSend, onMove, onAll, onNone }) {
  const all = count === total && total > 0;
  const has = count > 0;

  return (
    <div className="nv fi" style={{ justifyContent: 'space-between', padding: '0 14px' }}>
      <button onClick={all ? onNone : onAll} style={{
        fontSize: 13, fontWeight: 500, color: 'var(--blue)', padding: '6px 2px',
      }}>
        {all ? 'Deselect All' : 'Select All'}
      </button>
      <div style={{ display: 'flex', gap: 7 }}>
        <button onClick={onMove} disabled={!has} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '8px 12px', borderRadius: 100, fontSize: 13, fontWeight: 600,
          background: has ? 'var(--fg)' : 'var(--muted)', color: has ? 'white' : 'var(--mfg)',
          transition: 'all .14s',
        }}>
          <Move /> Move
        </button>
        <button onClick={onSend} disabled={!has} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '8px 12px', borderRadius: 100, fontSize: 13, fontWeight: 600,
          background: has ? 'var(--primary)' : 'var(--muted)', color: has ? 'white' : 'var(--mfg)',
          boxShadow: has ? '0 3px 10px rgba(87,39,230,.35)' : 'none', transition: 'all .14s',
        }}>
          <Send /> {BRAND}
        </button>
      </div>
    </div>
  );
}
