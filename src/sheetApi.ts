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
    redirect: 'follow',
  });

  const text = await res.text();
  console.log('Response text:', text);

  if (!res.ok || !text.includes('OK')) {
    throw new Error('Save failed: ' + text);
  }

  return payload;
}

export async function deleteRemote(id: string) {
  const url = `${BASE}?secret=${encodeURIComponent(SECRET)}&action=delete`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Delete failed');
  return true;
}
