import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Fix for default Leaflet marker icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapWidget = () => {
  const { lang } = useLanguage();
  // Coordinates for Casablanca
  const position = [33.5731, -7.5898];

  const title = lang === 'ar' ? 'مقر الأكاديمية (الدار البيضاء)' : 'Academy Location (Casablanca)';

  return (
    <div className="glass-card p-6 rounded-2xl bg-[#e0fcfc]/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg relative">
      <h3 className="text-xl font-bold font-orbitron mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
        <MapPin className="text-rose-500" /> {title}
      </h3>
      <div className="h-[300px] w-full rounded-xl overflow-hidden border border-cyan-300 dark:border-slate-700 relative z-10">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.tomtom.com/en_gb/routing-and-maps/">TomTom</a>'
            url={`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${import.meta.env.VITE_TOMTOM_API_KEY || 'cnwPNsQJpuQQ2VaAsHyPDtTXSnvtwr7k'}`}
          />
          <Marker position={position}>
            <Popup>
              <strong>GITM Academy</strong> <br />
              {lang === 'ar' ? 'مختبر الابتكار التكنولوجي.' : 'Technological Innovation Lab.'}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapWidget;
