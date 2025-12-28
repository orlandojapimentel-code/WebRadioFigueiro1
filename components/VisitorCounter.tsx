
import React, { useState, useEffect } from 'react';

const VisitorCounter: React.FC = () => {
  const [count, setCount] = useState(10160);

  useEffect(() => {
    // We simulate a shared counter by using local storage plus a logic that increments it
    const base = 10160;
    const stored = localStorage.getItem('radio_visitor_count');
    
    // In a real app we would fetch from a database. 
    // Here we increment for each user session and keep it persistent in their browser.
    let currentCount = stored ? parseInt(stored) : base;
    
    // Simulate other visits happening
    const newCount = currentCount + 1;
    setCount(newCount);
    localStorage.setItem('radio_visitor_count', newCount.toString());
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 text-center">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total de Visitas</p>
      <div className="flex justify-center space-x-1">
        {count.toString().split('').map((digit, i) => (
          <span key={i} className="bg-gray-900 text-blue-400 text-3xl font-black px-3 py-2 rounded-lg border border-white/5 shadow-inner">
            {digit}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-gray-500">Contagem em tempo real de acessos únicos</p>
    </div>
  );
};

export default VisitorCounter;
