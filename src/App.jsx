import React, { useState, useRef, useEffect } from 'react';

// Hooks
import { useCollections } from './hooks/useCollections';
import { useSession } from './hooks/useSession';

// API
import { uploadImages } from './api/uploads';

// Utils
import { toDataURL } from './lib/utils';
import { BRAND } from './lib/brand';

// Components
import Nav from './components/Nav';
import SelBar from './components/SelBar';
import Card from './components/Card';
import Thumb from './components/Thumb';
import CollectionDropdown from './components/CollectionDropdown';
import { ChevDown, Plus, Send, Dots } from './components/icons';

// Sheets
import AddImgSheet from './components/sheets/AddImgSheet';
import NewColSheet from './components/sheets/NewColSheet';
import OptionsSheet from './components/sheets/OptionsSheet';
import RenameSheet from './components/sheets/RenameSheet';
import ConfirmSheet from './components/sheets/ConfirmSheet';
import MoveSheet from './components/sheets/MoveSheet';

export default function App() {
  // ── Session (QR code link) ──
  const { session, linked } = useSession();

  // ── Collections state ──
  const {
    collections: cols,
    active,
    activeId: aid,
    setActiveId: setAid,
    addCollection: addCol,
    renameCollection: renameCol,
    deleteCollection: deleteCol,
    addImage: addImg,
    moveImages,
  } = useCollections();

  // ── UI state ──
  const [tab, setTab] = useState('gallery');
  const [sel, setSel] = useState(false);
  const [selIds, setSelIds] = useState(new Set());
  const [showMove, setShowMove] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [uploading, setUploading] = useState(false);

  const camRef = useRef(null);
  const rollRef = useRef(null);

  // Reset selection when switching collection or tab
  useEffect(() => { setSel(false); setSelIds(new Set()); }, [aid, tab]);

  // ── Camera handling ──
  const handleCapture = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    for (const f of files) {
      const url = await toDataURL(f);
      addImg(url);
    }
    e.target.value = '';
  };
  const openCamera = () => camRef.current?.click();
  const openRoll = () => rollRef.current?.click();

  // ── Selection ──
  const toggle = (id) => setSelIds((p) => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const exitSel = () => { setSel(false); setSelIds(new Set()); };
  const pressImg = (id) => {
    if (sel) toggle(id);
    else { setSel(true); setSelIds(new Set([id])); }
  };
  const handleTab = (t) => {
    if (t === 'camera') camRef.current?.click();
    else { exitSel(); setTab(t); }
  };
  const handleMv = (to) => {
    moveImages(active.id, to, [...selIds]);
    setShowMove(false);
    exitSel();
  };

  // ── Send to desktop ──
  const sendToDesktop = async (images) => {
    setUploading(true);
    try {
      const result = await uploadImages(images, active.name);
      if (result.stub) {
        alert(`Sent ${images.length} image${images.length !== 1 ? 's' : ''} to ${BRAND}`);
      } else if (result.success) {
        alert(`Uploaded ${result.count} image${result.count !== 1 ? 's' : ''} successfully`);
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
      <input ref={rollRef} type="file" accept="image/*" multiple onChange={handleCapture} style={{ display: 'none' }} />

      {/* ── GALLERY ── */}
      {tab === 'gallery' && (
        <>
          <div className="hd" style={{ paddingTop: 'calc(var(--safe-t) + 8px)', paddingBottom: 8 }}>
            {sel ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
                <button onClick={exitSel} style={{ fontSize: 16, color: 'var(--blue)', minWidth: 64 }}>Cancel</button>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)' }}>
                  {selIds.size > 0 ? `${selIds.size} Selected` : 'Select Items'}
                </span>
                <div style={{ minWidth: 64 }} />
              </div>
            ) : (
              <button onClick={() => setSheet('picker')} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                width: '100%', padding: '8px 10px', borderRadius: 14, background: 'var(--muted)', textAlign: 'left',
              }}>
                <Thumb imgs={active.images} sz={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg)', letterSpacing: -0.2 }}>{active.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--mfg)', marginTop: 1 }}>{active.images.length} items</div>
                </div>
                <div style={{
                  color: 'var(--mfg)', marginRight: 2,
                  transform: sheet === 'picker' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform .2s',
                }}>
                  <ChevDown />
                </div>
              </button>
            )}
          </div>

          <div className="bd" style={{ padding: 6 }}>
            {active.images.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: 240, gap: 14,
              }}>
                <p style={{ fontSize: 15, color: 'var(--mfg)' }}>No images yet</p>
                <button onClick={() => setSheet('addimg')} style={{
                  padding: '10px 22px', borderRadius: 100, fontSize: 14, fontWeight: 600,
                  background: 'var(--primary)', color: 'white',
                }}>Add a photo</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: sel ? 4 : 6 }}>
                {active.images.map((img) => (
                  <Card key={img.id} image={img} sel={sel} selected={selIds.has(img.id)} onPress={() => pressImg(img.id)} />
                ))}
              </div>
            )}
            <div style={{ height: 72 }} />
          </div>

          {!sel && (
            <button onClick={() => setSheet('addimg')} aria-label="Add photo" style={{
              position: 'absolute', bottom: 'calc(var(--nav-h) + var(--safe-b) + 12px)', right: 14,
              width: 50, height: 50, borderRadius: '50%', background: 'var(--primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(87,39,230,.45)', zIndex: 10,
            }}>
              <Plus s={22} />
            </button>
          )}

          {showMove && (
            <MoveSheet collections={cols} currentId={active.id} count={selIds.size} onMove={handleMv} onClose={() => setShowMove(false)} />
          )}
        </>
      )}

      {/* ── COLLECTIONS ── */}
      {tab === 'cols' && (
        <>
          <div className="hd" style={{ paddingTop: 'calc(var(--safe-t) + 8px)', paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', letterSpacing: -0.4 }}>Collections</span>
              <button onClick={() => setSheet('newcol')} style={{
                width: 30, height: 30, borderRadius: '50%', background: 'var(--muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus s={16} />
              </button>
            </div>
          </div>

          <div className="bd" style={{ padding: '10px 12px' }}>
            {cols.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: 240, gap: 14,
              }}>
                <p style={{ fontSize: 15, color: 'var(--mfg)' }}>No collections yet</p>
                <button onClick={() => setSheet('newcol')} style={{
                  padding: '10px 22px', borderRadius: 100, fontSize: 14, fontWeight: 600,
                  background: 'var(--primary)', color: 'white',
                }}>Create one</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cols.map((c) => {
                  const ia = c.id === aid;
                  return (
                    <div key={c.id} onClick={() => { setAid(c.id); setTab('gallery'); }} style={{
                      display: 'flex', alignItems: 'center', gap: 11,
                      padding: '10px 10px', borderRadius: 14, cursor: 'pointer',
                      background: 'var(--muted)', border: `1.5px solid ${ia ? 'var(--primary)' : 'transparent'}`,
                    }}>
                      <Thumb imgs={c.images} sz={48} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 14, fontWeight: 700, color: 'var(--fg)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--mfg)', marginTop: 1 }}>{c.images.length} items</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); sendToDesktop(c.images); }} style={{
                        display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', borderRadius: 100,
                        fontSize: 12, fontWeight: 600, background: 'var(--primary)', color: 'white', flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(87,39,230,.25)',
                      }}>
                        <Send /> {BRAND}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setSheet({ type: 'opts', col: c }); }} style={{
                        width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'var(--mfg)', flexShrink: 0,
                      }}>
                        <Dots />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ height: 16 }} />
          </div>
        </>
      )}

      {/* ── BOTTOM BAR ── */}
      {sel && tab === 'gallery' ? (
        <SelBar
          count={selIds.size}
          total={active.images.length}
          onSend={() => { sendToDesktop(active.images.filter((i) => selIds.has(i.id))); exitSel(); }}
          onMove={() => setShowMove(true)}
          onAll={() => setSelIds(new Set(active.images.map((i) => i.id)))}
          onNone={() => setSelIds(new Set())}
        />
      ) : (
        <Nav tab={tab} onTab={handleTab} />
      )}

      {/* ── SHEETS ── */}
      {sheet === 'addimg' && <AddImgSheet onCamera={openCamera} onRoll={openRoll} onClose={() => setSheet(null)} />}
      {sheet === 'picker' && (
        <CollectionDropdown
          collections={cols} activeId={aid}
          onPick={(id) => { setAid(id); setTab('gallery'); }}
          onNew={() => setSheet('newcol')}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'newcol' && <NewColSheet onAdd={addCol} onClose={() => setSheet(null)} />}
      {sheet?.type === 'opts' && (
        <OptionsSheet col={sheet.col}
          onRename={() => setSheet({ type: 'rename', col: sheet.col })}
          onDelete={() => setSheet({ type: 'del', col: sheet.col })}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet?.type === 'rename' && (
        <RenameSheet current={sheet.col.name} onSave={(n) => renameCol(sheet.col.id, n)} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === 'del' && (
        <ConfirmSheet name={sheet.col.name}
          onConfirm={() => { deleteCol(sheet.col.id); setSheet(null); }}
          onClose={() => setSheet(null)}
        />
      )}
    </>
  );
}
