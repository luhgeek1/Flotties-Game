import { ROUTE_PATH } from "../lib/route-guard";

export function normalizePath(path: string): string {
  if (path.length === 0) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function getLocationPath(): string {
  const { hash, pathname } = window.location;

  if (!hash || hash === "#") {
    return normalizePath(pathname);
  }

  return normalizePath(hash.slice(1));
}

export function toHashUrl(path: string): string {
  return path === ROUTE_PATH.setup ? "/#/" : `/#${path}`;
}

export function replaceHashPath(path: string) {
  window.history.replaceState(null, "", toHashUrl(path));
}

export function pushHashPath(path: string) {
  window.history.pushState(null, "", toHashUrl(path));
}
