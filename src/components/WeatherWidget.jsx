import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Loader, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WeatherWidget = () => {
  const { lang } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cityName, setCityName] = useState(lang === 'ar' ? 'الدار البيضاء' : 'Casablanca');

  useEffect(() => {
    const fetchWeather = async (lat = 33.57, lon = -7.59, isFallback = true) => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        
        if (apiKey) {
          // OpenWeather API
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
          if (!res.ok) throw new Error('OpenWeather API Failed');
          const data = await res.json();
          setWeather({
            temperature_2m: Math.round(data.main.temp),
            weathercode: data.weather[0].id, // Note: OpenWeather codes are different, we will map them
            windspeed_10m: Math.round(data.wind.speed * 3.6), // convert m/s to km/h
            isOpenWeather: true
          });
          setCityName(data.name || (lang === 'ar' ? 'موقعك' : 'Your Location'));
        } else {
          // Fallback to Open-Meteo
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`);
          if (!res.ok) throw new Error('Failed to fetch weather');
          const data = await res.json();
          setWeather(data.current);

          if (!isFallback) {
            try {
              const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${lang}`);
              const geoData = await geoRes.json();
              const city = geoData.address.city || geoData.address.town || geoData.address.state || geoData.address.country;
              if (city) setCityName(city);
            } catch (geoErr) {
              console.error('Reverse geocoding failed', geoErr);
            }
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, false);
        },
        (err) => {
          console.warn('Geolocation denied or failed, using fallback.');
          fetchWeather(); // Fallback to Casablanca
        },
        { timeout: 10000 }
      );
    } else {
      fetchWeather();
    }
  }, [lang]);

  const getWeatherIcon = (code, isOpenWeather = false) => {
    if (isOpenWeather) {
      if (code >= 200 && code < 600) return <CloudRain className="text-blue-400" size={24} />;
      if (code >= 600 && code < 700) return <Cloud className="text-gray-200" size={24} />;
      if (code >= 801 && code <= 804) return <Cloud className="text-gray-400" size={24} />;
      return <Sun className="text-yellow-400" size={24} />;
    } else {
      if (code <= 3) return <Sun className="text-yellow-400" size={24} />;
      if (code <= 48) return <Cloud className="text-gray-400" size={24} />;
      return <CloudRain className="text-blue-400" size={24} />;
    }
  };

  if (loading) return (
    <div className="glass-card p-4 rounded-xl flex items-center justify-center h-24 bg-[#e0fcfc]/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700">
      <Loader className="animate-spin text-emerald-500" />
    </div>
  );

  if (error) return (
    <div className="glass-card p-4 rounded-xl flex items-center justify-center h-24 bg-red-100/30 dark:bg-red-900/30 backdrop-blur-md border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
      <AlertCircle className="mr-2" /> {lang === 'ar' ? 'خطأ في التحميل' : 'Error loading'}
    </div>
  );

  return (
    <div className="glass-card p-4 rounded-xl bg-[#e0fcfc]/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-lg hover-lift transition-transform">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 tracking-wider truncate flex items-center justify-between">
        <span>{lang === 'ar' ? 'الطقس' : 'Weather'}</span>
        <span className="text-emerald-600 dark:text-cyan-400 truncate max-w-[100px]" title={cityName}>{cityName}</span>
      </h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.weathercode, weather.isOpenWeather)}
          <div>
            <div className="text-2xl font-bold font-orbitron text-gray-800 dark:text-white">
              {weather.temperature_2m}°C
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <Wind size={16} className="text-emerald-500 dark:text-cyan-400" />
          <span>{weather.windspeed_10m} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
