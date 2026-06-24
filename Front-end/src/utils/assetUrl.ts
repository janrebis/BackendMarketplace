const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5220/api';
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${SERVER_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
