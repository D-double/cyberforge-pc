import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';
import { DEFAULT_THEME, isTheme, Theme, THEME_STORAGE_KEY } from '@/lib/theme';

// The <html data-theme> attribute is the single source of truth; React only mirrors it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  const theme = document.documentElement.dataset.theme;
  return isTheme(theme) ? theme : DEFAULT_THEME;
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggleTheme = useCallback(() => applyTheme(getSnapshot() === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggleTheme };
}

/** React resets <html> attributes on the Strict Mode remount in development; restore the saved theme. */
export function useRestoreTheme() {
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored) document.documentElement.dataset.theme = stored;
  }, []);
}
