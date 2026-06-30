import React from 'react';

const EmbedRenderer = ({ url }) => {
  if (!url) return null;

  // YouTube Embed
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Facebook Video Embed
  const fbMatch = url.match(/facebook\.com\/.*\/videos\/.*/);
  if (fbMatch) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl flex justify-center bg-black/20" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`}
          scrolling="no"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
      </div>
    );
  }

  // Generic link if not matching specific embeds
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block px-4 py-2 bg-white/5 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors break-all"
    >
      {url}
    </a>
  );
};

export default EmbedRenderer;
