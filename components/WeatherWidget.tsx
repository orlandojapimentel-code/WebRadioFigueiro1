
import React, { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  apparentTemp: number;
  code: number;
  wind: number;
  isDay: boolean;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Coordenadas aproximadas de Figueiró, Amarante
  const LAT = 41.2750;
  const LON = -8.2340;

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
        isDay: data.current.is_day === 1
      });
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar meteorologia:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000); // Atualiza a cada 30 min
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number, isDay: boolean) => {
    // Mapeamento simplificado de códigos WMO
    if (code === 0) return isDay ? '☀️' : '🌙'; // Limpo
    if (code <= 3) return isDay ? '⛅' : '☁️'; // Parcialmente nublado
    if (code <= 48) return '🌫️'; // Nevoeiro
    if (code <= 67) return '🌧️'; // Chuva/Chuvisco
    if (code <= 77) return '❄️'; // Neve
    if (code <= 82) return '🌦️'; // Aguaceiros
    if (code <= 99) return '⛈️'; // Trovoada
    return '☁️';
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Céu Limpo';
    if (code <= 3) return 'Parcialmente Nublado';
    if (code <= 48) return 'Nevoeiro';
    if (code <= 67) return 'Chuva';
    if (code <= 82) return 'Aguaceiros';
    if (code <= 99) return 'Trovoada';
    return 'Nublado';
  };

  if (loading) {
    return (
      <div className="bg-gray-800/40 p-6 rounded-[2.5rem] border border-white/5 animate-pulse h-32 flex items-center justify-center">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sincronizando tempo...</div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white dark:bg-gray-800/40 p-6 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl dark:shadow-2xl backdrop-blur-xl relative overflow-hidden group transition-all hover:border-blue-500/40">
      {/* Background Decorativo */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1 block">Estado do Tempo</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
              <svg className="w-3 h-3 mr-1.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
              Figueiró, Amarante
            </h4>
          </div>
          <div className="text-3xl filter drop-shadow-md">
            {getWeatherIcon(weather.code, weather.isDay)}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-start">
            <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {weather.temp}°
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg ml-1">C</span>
          </div>
          
          <div className="text-right space-y-1">
            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              {getWeatherDesc(weather.code)}
            </p>
            <div className="flex items-center justify-end space-x-3 text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-tighter">
              <span className="flex items-center">
                <svg className="w-2.5 h-2.5 mr-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
                Sente: {weather.apparentTemp}°
              </span>
              <span className="flex items-center">
                <svg className="w-2.5 h-2.5 mr-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                {weather.wind} km/h
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
