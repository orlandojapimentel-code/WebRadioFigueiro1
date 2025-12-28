
import React from 'react';

const Schedule: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 border-b border-gray-800 pb-4">
        <div className="p-3 bg-blue-600 rounded-2xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3 className="text-3xl font-black">Nossa Programação</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diária */}
        <div className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700">
          <h4 className="text-xl font-bold mb-6 text-blue-400">Programação Diária</h4>
          <div className="space-y-4">
            {[
              { time: "08:00 - 10:00", name: "Manhãs Figueiró", host: "Música para começar o dia" },
              { time: "10:00 - 13:00", name: "Top Hits", host: "As mais pedidas do momento" },
              { time: "13:00 - 15:00", name: "Almoço Musical", host: "Sons tranquilos para o meio do dia" },
              { time: "15:00 - 19:00", name: "Tardes em Movimento", host: "Energia para o seu regresso" }
            ].map((p, i) => (
              <div key={i} className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.host}</p>
                </div>
                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-blue-300">{p.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semanal */}
        <div className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700">
          <h4 className="text-xl font-bold mb-6 text-indigo-400">Destaques Semanais</h4>
          <div className="space-y-6">
            <div className="bg-indigo-900/20 p-4 rounded-2xl border border-indigo-500/30">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-tighter mb-1">Domingos | 22:00 - 00:00</p>
              <h5 className="text-lg font-bold text-white mb-2">Night Grooves</h5>
              <p className="text-sm text-gray-400">1ª Hora: <span className="text-white">DJ Durval</span></p>
              <p className="text-sm text-gray-400">2ª Hora: <span className="text-white">DJ Convidado</span></p>
            </div>

            <div className="bg-blue-900/20 p-4 rounded-2xl border border-blue-500/30">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-tighter mb-1">Quartas e Sextas | 13:00 & 20:00</p>
              <h5 className="text-lg font-bold text-white mb-2">Prazeres Interrompidos</h5>
              <p className="text-sm text-gray-400">Podcast exclusivo com os melhores livros em um minuto.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
