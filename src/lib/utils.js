/** Unique ID generator */
let _n = 0;
export const uid = () => `${Date.now()}-${++_n}`;

/** Convert a File to a data URL (for localStorage persistence) */
export const toDataURL = (file) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
