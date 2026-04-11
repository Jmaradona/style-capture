import { useState, useEffect } from 'react';
import { loadState, saveState } from '../lib/storage';
import { SAMPLE_COLLECTIONS } from '../data/samples';
import { uid } from '../lib/utils';

/**
 * Central hook for collection state management.
 * Handles persistence to localStorage automatically.
 */
export function useCollections() {
  const saved = loadState();
  const [cols, setCols] = useState(saved?.cols || SAMPLE_COLLECTIONS);
  const [activeId, setActiveId] = useState(saved?.aid || SAMPLE_COLLECTIONS[0].id);

  // Persist on every change
  useEffect(() => {
    saveState({ cols, aid: activeId });
  }, [cols, activeId]);

  const active = cols.length > 0 ? (cols.find((c) => c.id === activeId) || cols[0]) : null;

  // ── Mutations ──

  const addCollection = (name) => {
    const c = { id: uid(), name, images: [] };
    setCols((p) => [...p, c]);
    setActiveId(c.id);
    return c;
  };

  const renameCollection = (id, name) => {
    setCols((p) => p.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const deleteCollection = (id) => {
    setCols((p) => {
      const next = p.filter((c) => c.id !== id);
      if (activeId === id) setActiveId(next[0]?.id || '');
      return next;
    });
  };

  const addImage = (url) => {
    setCols((p) =>
      p.map((c) =>
        c.id === activeId
          ? { ...c, images: [...c.images, { id: uid(), url }] }
          : c
      )
    );
  };

  const moveImages = (fromId, toId, imageIds) => {
    const idSet = new Set(imageIds);
    setCols((p) => {
      const from = p.find((c) => c.id === fromId);
      const moving = from ? from.images.filter((i) => idSet.has(i.id)) : [];
      return p.map((c) => {
        if (c.id === fromId)
          return { ...c, images: c.images.filter((i) => !idSet.has(i.id)) };
        if (c.id === toId)
          return { ...c, images: [...c.images, ...moving] };
        return c;
      });
    });
  };

  return {
    collections: cols,
    active,
    activeId,
    setActiveId,
    addCollection,
    renameCollection,
    deleteCollection,
    addImage,
    moveImages,
  };
}
