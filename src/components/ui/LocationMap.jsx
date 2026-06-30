import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLanguage } from '../../context/LanguageContext';

// Fix Leaflet's default icon issue with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LocationMap({ lat, lng, title, locationName }) {
  const { lang } = useLanguage();
  const defaultPosition = [33.5731, -7.5898]; // Casablanca Default
  const position = lat && lng ? [lat, lng] : defaultPosition;

  useEffect(() => {
    // Add dark mode classes for Leaflet if needed
    const mapTiles = document.querySelectorAll('.leaflet-tile-pane');
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      mapTiles.forEach(tile => {
        tile.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
      });
    } else {
        mapTiles.forEach(tile => {
            tile.style.filter = 'none';
        });
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-xl z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', minHeight: '300px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className={`font-sans font-bold text-slate-800 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
              <h3 className="text-sm">{title || 'GITM Event'}</h3>
              <p className="text-xs text-slate-500 font-medium">{locationName || 'Casablanca, Morocco'}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
