import React from 'react';
import EmbedRenderer from './EmbedRenderer';

const RichContentRenderer = ({ content, mediaUrls = [] }) => {
  if (!content && (!mediaUrls || mediaUrls.length === 0)) return null;

  return (
    <div className="rich-content prose prose-invert max-w-none">
      {content && (
        <div 
          className="text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      )}
      
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="mt-8 space-y-6">
          {mediaUrls.map((url, idx) => {
            // Determine if it's an embed, image, or video based on URL
            if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('facebook.com/')) {
              return <EmbedRenderer key={idx} url={url} />;
            }
            
            if (url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) || url.includes('image/upload')) {
              return (
                <img 
                  key={idx} 
                  src={url} 
                  alt={`Media ${idx + 1}`} 
                  className="w-full rounded-xl shadow-lg border border-white/10" 
                />
              );
            }
            
            if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || url.includes('video/upload')) {
              return (
                <video 
                  key={idx} 
                  src={url} 
                  controls 
                  className="w-full rounded-xl shadow-lg border border-white/10" 
                />
              );
            }
            
            // Fallback to link
            return (
              <a 
                key={idx}
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 bg-white/5 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              >
                View Attachment
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RichContentRenderer;
