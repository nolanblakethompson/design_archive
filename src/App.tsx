import { useState, useEffect } from 'react';
import { LinkCard } from './components/LinkCard';
import { AddLinkForm } from './components/AddLinkForm';
import { Link } from 'lucide-react';
import React from 'react';

export interface WebsiteLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  screenshot?: string;
  createdAt: string;
}

export default function App() {
  const [links, setLinks] = useState<WebsiteLink[]>([]);

  // Load links from localStorage on mount
  useEffect(() => {
    const storedLinks = localStorage.getItem('websiteLinks');
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    }
  }, []);

  // Save links to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('websiteLinks', JSON.stringify(links));
  }, [links]);

  const handleAddLink = (newLink: Omit<WebsiteLink, 'id' | 'createdAt'>) => {
    const link: WebsiteLink = {
      ...newLink,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setLinks([link, ...links]);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="mb-12">
              <AddLinkForm onAddLink={handleAddLink} />
            </div>

          </div>
        </div>

        {/* Links Grid */}
        {links.length === 0 ? (
          <div className="text-center py-16">
            <Link className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No links saved yet. Add your first link above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}