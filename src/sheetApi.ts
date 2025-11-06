import { WebsiteLink } from './types';

// 👇 point to your deployed proxy
const PROXY = 'https://design-archive.vercel.app/api/proxy';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwE7hjv7iiYuLhchKTNhIWFO__qMFl7ssJ1s1uhaD0ZviYyj-XtbnbCsPQmtRFULbrG/exec';
export const SECRET = 'change-me';

// Helper to wrap URL through the proxy
function proxied(url: string) {
  return `${PROXY}?url=${encodeURIComponent(url)}`;
}

// --- FETCH LINKS ---
export async function fetchLinks(): Promise<WebsiteLink[]> {
  const res = await fetch(proxied(SCRIPT_URL));
  if (!res.ok) throw new Error('Failed to load links');
  return res.json();
}

// --- SAVE LINK ---
export async function saveLinkRemote(link: Omit<WebsiteLink, 'id' | 'createdAt'>) {
  const payload: WebsiteLink = {
    ...link,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  // Construct the *real* Apps Script URL first, THEN proxy it
  const targetUrl = `${SCRIPT_URL}?secret=${SECRET}`;

  const res = await fetch(proxied(targetUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log('Response text:', text);

  if (!res.ok || !text.includes('OK')) {
    throw new Error('Save failed: ' + text);
  }

  return payload;
}

// --- DELETE LINK ---
export async function deleteRemote(id: string) {
  const targetUrl = `${SCRIPT_URL}?secret=${SECRET}&action=delete`;

  const res = await fetch(proxied(targetUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error('Delete failed');
  return true;
}
