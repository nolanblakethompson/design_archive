import { useEffect, useState } from 'react';
import { WebsiteLink } from '../types';
import { fetchLinks, saveLinkRemote, deleteRemote } from '../sheetApi';

export function useLinks() {
  const [links, setLinks] = useState<WebsiteLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const remote = await fetchLinks();
        setLinks(remote.sort((a,b)=> b.createdAt.localeCompare(a.createdAt)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addLink = async (link: Omit<WebsiteLink, 'id' | 'createdAt'>) => {
    const saved = await saveLinkRemote(link);
    setLinks(prev => [saved, ...prev]);
  };

  const deleteLink = async (id: string) => {
    await deleteRemote(id);  // comment this out if not using server-side delete yet
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  return { links, addLink, deleteLink, loading };
}
