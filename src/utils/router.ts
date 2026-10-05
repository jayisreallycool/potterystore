import { useEffect, useState } from 'react';

/**
 * Minimal path router built on the History API.
 * Routes: "/", "/about", "/custom-orders", "/piece/:id"
 */
export type Route =
  | { name: 'home' }
  | { name: 'about' }
  | { name: 'custom-orders' }
  | { name: 'piece'; id: string };

export function parseRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/about') return { name: 'about' };
  if (path === '/custom-orders') return { name: 'custom-orders' };
  const piece = path.match(/^\/piece\/([^/]+)$/);
  if (piece) {
    try {
      return { name: 'piece', id: decodeURIComponent(piece[1]) };
    } catch {
      return { name: 'home' };
    }
  }
  return { name: 'home' };
}

export function piecePath(id: string): string {
  return `/piece/${encodeURIComponent(id)}`;
}

const NAV_EVENT = 'cliffcooks:navigate';

export function navigate(path: string, options: { replace?: boolean } = {}) {
  const current = window.location.pathname + window.location.search;
  if (path !== current) {
    if (options.replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
  }
  window.dispatchEvent(new Event(NAV_EVENT));
}

export function useRoute(): Route {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  return parseRoute(pathname);
}
