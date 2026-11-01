export type Theme = 'dark' | 'light';

export const DEFAULT_THEME: Theme = 'dark';
export const THEME_STORAGE_KEY = 'cf_theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

/** Runs in <head> before the first paint so a saved theme never flashes. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
