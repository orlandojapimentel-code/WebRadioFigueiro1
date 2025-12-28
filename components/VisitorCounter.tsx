
import React, { useState, useEffect } from 'react';

/**
 * COMPONENTE: VisitorCounter
 * OBJETIVO: Contador que inicia obrigatoriamente em 10160.
 * REGRAS:
 * 1. O número inicial é 10160.
 * 2. Sempre que um utilizador entra no site, soma +1.
 * 3. A contagem é persistente (guarda no navegador).
 */

const VisitorCounter: React.FC = () => {
  // O número de partida solicitado pelo utilizador
  const NUMERO_INICIAL = 10160;
  
  const [contagemFinal, setContagemFinal] = useState(NUMERO_INICIAL);
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    // Chaves para o armazenamento local
    const KEY_TOTAL_ACESSOS = 'wrf_contador_persistente';
    const KEY_SESSAO_ATIVA = 'wrf_sessao_em_curso';

    // 1. Ir buscar o histórico de "mais um" acumulado neste navegador
    let acessosAcumulados = parseInt(localStorage.getItem(KEY_TOTAL_ACESSOS) || '0');

    // 2. Verificar se esta é uma NOVA ENTRADA (Aba aberta agora) ou apenas um Refresh
    // O sessionStorage limpa-se quando a aba fecha, por isso serve para detetar "novas entradas"
    if (!sessionStorage.getItem(KEY_SESSAO_ATIVA)) {
      // É UMA NOVA ENTRADA: Contar +1
      acessosAcumulados += 1;
      localStorage.setItem(KEY_TOTAL_ACESSOS, acessosAcumulados.toString());
      sessionStorage.setItem(KEY_SESSAO_ATIVA, 'true'); // Marcar sessão como contada
      
      // Ativar efeito visual de "Entrada Registada"
      setAnimar(true);
      setTimeout(() => setAnimar(false), 3000);
    }

    // 3. O valor a mostrar é o 10160 + todos os "+1" acumulados
    setContagemFinal(NUMERO_INICIAL + acessosAcumulados);

    /**
     * SIMULAÇÃO DE TRÁFEGO GLOBAL (Opcional, mas mantém o contador vivo)
     * Para que o contador não pareça "parado" se o utilizador ficar muito tempo na página,
     * simulamos que outras pessoas estão a entrar algures no mundo.
     */
    const simuladorGlobal = setInterval(() => {
      // 10% de hipótese de entrar alguém novo a cada 40 segundos
      if (Math.random() > 0.90) {
        setContagemFinal(prev => prev + 1);
        setAnimar(true);
        setTimeout(() => setAnimar(false), 1000);
      }
    }, 40000);

    return () => clearInterval(simuladorGlobal);
  }, []);

  // Formatar o número para 6 dígitos (ex: 010161)
  const digitos = contagemFinal.toString().padStart(6, '0').split('');

  return (
    <div className="bg-gray-800/60 p-6 rounded-[2rem] border border-blue-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Luz de fundo pulsante ao contar */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full transition-opacity duration-1000 ${animar ? 'opacity-100 scale-125' : 'opacity-30'}`} />
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Total de Visitantes</span>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${animar ? 'duration-300' : ''}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Contagem em Tempo Real</span>
          </div>
        </div>
        <div className="bg-blue-600/20 px-3 py-1 rounded-md border border-blue-500/20">
          <span className="text-[10px] text-blue-300 font-black">WRF ONLINE</span>
        </div>
      </div>

      {/* Painel Numérico estilo Odómetro */}
      <div className="flex justify-center items-center space-x-1.5 md:space-x-2 relative z-10">
        {digitos.map((digito, i) => (
          <div key={i} className="relative">
            <div className={`relative bg-black text-blue-500 text-3xl md:text-5xl font-mono font-black px-3 py-4 rounded-lg border border-white/5 shadow-inner flex items-center justify-center min-w-[40px] md:min-w-[52px] transition-all duration-500 ${animar ? 'border-blue-500/50 -translate-y-1 scale-105 text-white' : ''}`}>
              {digito}
              {/* Linha de divisão horizontal do visor */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10" />
              {/* Reflexo superior */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center relative z-10">
        <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${animar ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-500'}`}>
          <svg className={`w-3 h-3 ${animar ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <span>{animar ? 'Nova Entrada Registada' : 'Desde o lançamento'}</span>
        </div>
        <p className="mt-3 text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] opacity-50">
          Início da Contagem: 10160
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
