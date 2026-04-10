// Brand display name — decoded at runtime so it's not
// discoverable via plain-text repo search / GitHub indexing.
// base64("RmVybWF0") → brand name
const _b = 'RmVy' + 'bWF0';
export const BRAND = typeof atob !== 'undefined' ? atob(_b) : _b;
