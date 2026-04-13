import React, { useState } from 'react';
import Sheet from '../Sheet';
import { BRAND } from '../../lib/brand';
import { uploadImages } from '../../api/uploads';

export default function UploadSheet({ images, onClose }) {
  const [step, setStep] = useState('confirm'); // confirm | uploading | done
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const startUpload = async () => {
    setStep('uploading');
    setProgress(0);
    const res = await uploadImages(images, (done) => setProgress(done));
    setResults(res);
    setStep('done');
  };

  const ok = results ? results.filter((r) => r.success).length : 0;
  const fail = results ? results.length - ok : 0;

  // ── Confirm ──
  if (step === 'confirm') {
    return (
      <Sheet title={`Upload to ${BRAND}`} onClose={onClose}>
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 0 16px',
          scrollbarWidth: 'none',
        }}>
          {images.slice(0, 12).map((img) => (
            <img key={img.id} src={img.url} alt="" style={{
              width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0,
            }} />
          ))}
          {images.length > 12 && (
            <div style={{
              width: 56, height: 56, borderRadius: 10, background: 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600, color: 'var(--mfg)', flexShrink: 0,
            }}>+{images.length - 12}</div>
          )}
        </div>

        <p style={{ fontSize: 14, color: 'var(--mfg)', lineHeight: 1.5, marginBottom: 18 }}>
          You're about to upload <strong style={{ color: 'var(--fg)' }}>
          {images.length} image{images.length !== 1 ? 's' : ''}</strong> to
          your <strong style={{ color: 'var(--fg)' }}>{BRAND} Asset Library</strong>.
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600,
            background: 'var(--muted)', color: 'var(--fg)',
          }}>Cancel</button>
          <button onClick={startUpload} style={{
            flex: 1, padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600,
            background: 'var(--primary)', color: 'white',
            boxShadow: '0 3px 10px rgba(87,39,230,.35)',
          }}>Upload</button>
        </div>
      </Sheet>
    );
  }

  // ── Uploading ──
  if (step === 'uploading') {
    const pct = images.length > 0 ? (progress / images.length) * 100 : 0;
    return (
      <Sheet title="Uploading..." onClose={() => {}}>
        <div style={{ padding: '8px 0 12px' }}>
          <div style={{ fontSize: 14, color: 'var(--mfg)', marginBottom: 12 }}>
            {progress} of {images.length} image{images.length !== 1 ? 's' : ''}
          </div>
          <div style={{
            width: '100%', height: 6, borderRadius: 3, background: 'var(--muted)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 3, background: 'var(--primary)',
              width: `${pct}%`, transition: 'width .3s ease',
            }} />
          </div>
        </div>
      </Sheet>
    );
  }

  // ── Done ──
  return (
    <Sheet title="Upload Complete" onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', margin: '0 auto 14px',
          background: fail === 0 ? '#e8f5e9' : '#fff3e0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          {fail === 0 ? (
            <svg width="24" height="24" fill="none" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="#ff9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          )}
        </div>

        {ok > 0 && (
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>
            {ok} image{ok !== 1 ? 's' : ''} uploaded
          </p>
        )}
        {fail > 0 && (
          <>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#e53935', marginTop: 4 }}>
              {fail} image{fail !== 1 ? 's' : ''} failed
            </p>
            <div style={{
              marginTop: 8, padding: '10px 12px', borderRadius: 10,
              background: '#fff3e0', fontSize: 12, color: '#bf360c',
              lineHeight: 1.6, textAlign: 'left', maxHeight: 100, overflowY: 'auto',
            }}>
              {[...new Set(results.filter((r) => !r.success).map((r) => r.error))].map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          </>
        )}
      </div>

      <button onClick={onClose} style={{
        width: '100%', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600,
        background: 'var(--primary)', color: 'white', marginTop: 12,
        boxShadow: '0 3px 10px rgba(87,39,230,.35)',
      }}>Done</button>
    </Sheet>
  );
}
