import { WebsiteLink } from './types';

export const BASE = 'https://script.google.com/macros/s/AKfycbwE7hjv7iiYuLhchKTNhIWFO__qMFl7ssJ1s1uhaD0ZviYyj-XtbnbCsPQmtRFULbrG/exec'; // <-- paste your Web app URL
export const SECRET = 'change-me'; // <-- must match Apps Script SECRET

export async function fetchLinks(): Promise<WebsiteLink[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to load links');
  return res.json();
}

export async function saveLinkRemote(link: Omit<WebsiteLink, 'id' | 'createdAt'>) {
  const payload: WebsiteLink = {
    ...link,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const res = await fetch(`${BASE}?secret=${encodeURIComponent(SECRET)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Save failed');
  return payload; // return what we appended
}

// OPTIONAL: hook up delete to Apps Script’s doPostDelete
export async function deleteRemote(id: string) {
  const url = `${BASE.replace('/exec', '/exec')}/doPostDelete`; // same base; Apps Script routes by function name
  const res = await fetch(`${url}?secret=${encodeURIComponent(SECRET)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Delete failed');
  return true;
}
