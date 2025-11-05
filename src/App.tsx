import React from 'react';
import { LinkCard } from './components/LinkCard';
import { AddLinkForm } from './components/AddLinkForm';
import { Link as LinkIcon } from 'lucide-react'; // alias to avoid name collision
import { useLinks } from './hooks/useLinks';

export interface WebsiteLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  screenshot?: string;
  createdAt: string;
}

export default function App() {
  const { links, addLink, deleteLink, loading } = useLinks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="mb-12">
              <AddLinkForm onAddLink={addLink} />
            </div>
          </div>
        </div>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading…</div>
        ) : links.length === 0 ? (
          <div className="text-center py-16">
            <LinkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No links saved yet. Add your first link above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={deleteLink}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
