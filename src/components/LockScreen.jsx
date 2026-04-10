import React, { useState, useRef, useEffect } from 'react';

/**
 * PIN lock screen.
 * Shown before the user can access the app.
 * PIN is hashed and stored — never in plain text in the bundle.
 */

// SHA-256 hash of the PIN (hashed at build time concept — for now we hash on check)
// Default PIN: 1234 → change this hash when you set your real PIN
// To generate: echo -n "YOUR_PIN" | shasum -a 256
const PIN_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; // "1234"

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const SESSION_KEY = 'style-capture-auth';

export default function LockScreen({ onUnlock }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    // Check if already authenticated this session
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      onUnlock();
      return;
    }
    refs[0].current?.focus();
  }, []);

  const handleChange = async (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const next = [...pin];
    next[index] = value.slice(-1); // single digit
    setPin(next);
    setError(false);

    if (value && index < 3) {
      refs[index + 1].current?.focus();
    }

    // Check PIN when all 4 digits entered
    if (next.every(d => d !== '')) {
      const hash = await hashPin(next.join(''));
      if (hash === PIN_HASH) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        onUnlock();
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => {
          setShake(false);
          setPin(['', '', '', '']);
          refs[0].current?.focus();
        }, 500);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: 32, background: 'var(--bg)',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16, background: 'var(--primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>
        Enter PIN
      </h1>
      <p style={{ fontSize: 14, color: 'var(--mfg)', marginBottom: 32, textAlign: 'center' }}>
        Enter your access code to continue
      </p>

      <div style={{
        display: 'flex', gap: 12, marginBottom: 24,
        animation: shake ? 'shakeX .4s ease' : 'none',
      }}>
        {pin.map((digit, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            style={{
              width: 52, height: 60, borderRadius: 14, fontSize: 24, fontWeight: 700,
              textAlign: 'center', background: 'var(--muted)',
              color: 'var(--fg)',
              border: `2px solid ${error ? 'var(--red)' : digit ? 'var(--primary)' : 'transparent'}`,
              transition: 'border-color .15s',
              caretColor: 'var(--primary)',
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ fontSize: 13, color: 'var(--red)', fontWeight: 500 }}>
          Incorrect PIN
        </p>
      )}

      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
