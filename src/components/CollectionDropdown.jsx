import React from 'react';
import Thumb from './Thumb';
import { Chk, Plus } from './icons';

export default function CollectionDropdown({ collections, activeId, onPick, onNew, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40 }} />
      <div className="sd" style={{
        position: 'absolute',
        top: 'calc(var(--safe-t) + 76px)',
        left: 12, right: 12, zIndex: 41,
        background: '#fff', borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.06)',
        overflow: 'hidden', maxHeight: '60vh', overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {collections.map((c) => {
            const a = c.id === activeId;
            return (
              <button key={c.id} onClick={() => { onPick(c.id); onClose(); }} style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '9px 10px', borderRadius: 11, textAlign: 'left',
                background: a ? '#EDE9FD' : 'transparent',
              }}>
                <Thumb imgs={c.images} sz={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--fg)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--mfg)', marginTop: 1 }}>{c.images.length} items</div>
                </div>
                {a && (
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0,
                  }}>
                    <Chk />
                  </div>
                )}
              </button>
            );
          })}
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          <button onClick={() => { onClose(); onNew(); }} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '9px 10px', borderRadius: 11, textAlign: 'left',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9, border: '1.5px dashed var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)', flexShrink: 0,
            }}>
              <Plus s={14} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>New Collection</span>
          </button>
        </div>
      </div>
    </>
  );
}
