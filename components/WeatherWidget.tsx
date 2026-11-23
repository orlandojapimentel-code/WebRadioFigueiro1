import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherData {
  temp: number;
  apparentTemp: number;
  code: number;
  wind: number;
  isDay: boolean;
}

const WeatherIcon: React.FC<{ code: number; isDay: boolean }> = ({ code, isDay }) => {
  if (code === 0 && isDay) {
    return (
      <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
      </svg>
    );
  }
  if (code === 0 && !isDay) {
    return (
      <svg className="w-9 h-9 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
  }
  if (code <= 3) {
    return (
      <svg className="w-10 h-10 text-sky-500 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    );
  }
  if (code <= 48) {
    return (
      <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M4 14h12M6 18h14" />
      </svg>
    );
  }
  if (code <= 67 || (code >= 80 && code <= 82)) {
    return (
      <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242M8 19v2m4-3v2m4-1v2" />
      </svg>
    );
  }
  if (code <= 77) {
    return (
      <svg className="w-10 h-10 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v18m-6.364-14.364l12.728 12.728m0-12.728L5.636 18.364M3 12h18" />
      </svg>
    );
  }
  return (
    <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
};

const WeatherWidget: React.FC = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const LAT = 41.275;
  const LON = -8.234;

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`
      );
      const data = await response.json();

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        apparentTemp: Math.round(data.current.apparent_temperature),
        code: data.current.weather_code,
        wind: Math.round(data.current.wind_speed_10m),
        isDay: data.current.is_day === 1,
      });
    } catch (error) {
      console.error('Erro ao carregar meteorologia:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherDesc = (code: number) => {
    if (code === 0) return t.weather.clear;
    if (code <= 3) return t.weather.partlyCloudy;
    if (code <= 48) return t.weather.fog;
    if (code <= 67) return t.weather.rain;
    if (code <= 77) return t.weather.snow;
    if (code <= 82) return t.weather.showers;
    if (code <= 99) return t.weather.storm;
    return t.weather.cloudy;
  };

  if (loading) {
    return (
      <div className="glass-card p-6 h-36 flex items-center justify-center">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t.weather.syncing}
        </span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="glass-card glass-card-interactive p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 block">
            {t.weather.kicker}
          </span>
          <h4 className="text-sm font-brand font-bold text-slate-900 dark:text-white mt-0.5">
            {t.weather.location}
          </h4>
        </div>
        <WeatherIcon code={weather.code} isDay={weather.isDay} />
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline tabular-nums">
          <span className="text-4xl font-brand font-black text-slate-900 dark:text-white tracking-tight">
            {weather.temp}°
          </span>
          <span className="text-red-600 dark:text-red-400 font-bold text-base ml-1">C</span>
        </div>

        <div className="text-right space-y-0.5">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {getWeatherDesc(weather.code)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {t.weather.feelsLike} {weather.apparentTemp}°C · {weather.wind} km/h
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
