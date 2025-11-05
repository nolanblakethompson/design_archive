import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Trash2, Calendar, Globe } from 'lucide-react';
import { WebsiteLink } from '../App';
import React from 'react';

interface LinkCardProps {
  link: WebsiteLink;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Generate screenshot URL using a free screenshot service
  const getScreenshotUrl = (url: string) => {
    const encodedUrl = encodeURIComponent(url);
    return `https://api.screenshotmachine.com/?key=demo&url=${encodedUrl}&dimension=1024x768`;
  };

  // Use custom screenshot if available, otherwise use API
  const screenshotSrc = link.screenshot || getScreenshotUrl(link.url);

  return (
    <Card className="group relative h-64 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageError ? (
          <>
            <img
              src={screenshotSrc}
              alt={`Preview of ${link.title}`}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">
                  <Globe className="w-12 h-12" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
            <Globe className="w-12 h-12 text-gray-400" />
            <span className="text-gray-500">{getDomain(link.url)}</span>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
        {/* Top Section - Title and Description */}
        <div className="space-y-2">
          <h3 className="text-white line-clamp-2">{link.title}</h3>
          <p className="text-white/80 text-sm">{getDomain(link.url)}</p>
          {link.description && (
            <p className="text-white/70 text-sm line-clamp-3">{link.description}</p>
          )}
        </div>

        {/* Bottom Section - Date and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-white/70">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">{formatDate(link.createdAt)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(link.url, '_blank');
              }}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(link.id);
              }}
              className="bg-red-500/80 hover:bg-red-600 text-white border-red-500/30"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
