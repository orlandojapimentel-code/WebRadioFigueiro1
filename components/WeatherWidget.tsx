
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="glass-card p-6 h-36 flex items-center justify-center animate-pulse">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Sincronizando Meteorologia...
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="glass-card glass-card-interactive p-6 relative overflow-hidden group">
      {/* Decorative Aura */}
      <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-0.5 block">
              Meteorologia Local
            </span>
            <h4 className="text-xs font-bold text-white flex items-center">
              <svg className="w-3 h-3 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              Figueiró, Amarante
            </h4>
          </div>
          <div className="text-3xl filter drop-shadow-md">
            {getWeatherIcon(weather.code, weather.isDay)}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline">
            <span className="text-4xl sm:text-5xl font-brand font-black text-white tracking-tight">
              {weather.temp}°
            </span>
            <span className="text-blue-400 font-bold text-base ml-1">C</span>
          </div>
          
          <div className="text-right space-y-1">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">
              {getWeatherDesc(weather.code)}
            </p>
            <div className="flex items-center justify-end space-x-3 text-[10px] text-slate-400 font-medium">
              <span className="flex items-center">
                <span className="opacity-60 mr-1">Sensação:</span> {weather.apparentTemp}°C
              </span>
              <span>•</span>
              <span className="flex items-center">
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
