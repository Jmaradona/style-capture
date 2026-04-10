import React from 'react';

const S = ({ size = 20, sw = 2, children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...p}>
    {children}
  </svg>
);

export { S };

export const ChevDown = () => <S size={18}><path d="m6 9 6 6 6-6" /></S>;
export const Plus = ({ s = 20 }) => <S size={s}><path d="M5 12h14" /><path d="M12 5v14" /></S>;
export const Chk = ({ s = 11 }) => <S size={s} sw={3}><path d="M20 6 9 17l-5-5" /></S>;
export const Grid = () => <S size={22}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></S>;
export const Cam = () => <S size={22}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></S>;
export const Folder = () => <S size={22}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></S>;
export const Send = ({ s = 14 }) => <S size={s}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></S>;
export const Move = ({ s = 14 }) => <S size={s}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></S>;
export const Dots = () => <S size={18}><circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" /></S>;
export const X = ({ s = 20 }) => <S size={s}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></S>;
export const Pencil = () => <S size={16}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></S>;
export const Trash = () => <S size={16}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></S>;
export const ImageIcon = () => <S size={16}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></S>;
