import { useState, useEffect } from 'react';
import { initSession, getSession, isLinked } from '../api/session';

/**
 * Hook that initializes the session from URL params (QR code)
 * and exposes session state to the app.
 */
export function useSession() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = initSession();
    setSession(s);
    setReady(true);
  }, []);

  return {
    session,
    ready,
    linked: !!session?.token,
    uid: session?.uid || null,
    folderId: session?.folderId || null,
  };
}
