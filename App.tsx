
import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Player from './components/Player';
import Schedule from './components/Schedule';
import GeminiAssistant from './components/GeminiAssistant';
import Partnerships from './components/Partnerships';
import Socials from './components/Socials';
import News from './components/News';
import VisitorCounter from './components/VisitorCounter';

const App: React.FC = () => {
  useEffect(() => {
    const forceUpdateFavicon = () => {
      // 1. Localizar e remover todos os links de ícone existentes para evitar conflitos de cache
      const links = document.querySelectorAll("link[rel*='icon'], link[rel='apple-touch-icon']");
      links.forEach(link => link.parentNode?.removeChild(link));

      // 2. Definir o caminho absoluto para o logo com cache-buster único
      const timestamp = Date.now();
      const logoUrl = `${window.location.origin}/logo.png?v=50&t=${timestamp}`;

      // 3. Criar e injetar o novo ícone standard
      const newIcon = document.createElement('link');
      newIcon.rel = 'icon';
      newIcon.type = 'image/png';
      newIcon.href = logoUrl;
      document.head.appendChild(newIcon);

      // 4. Criar e injetar o ícone para Apple/Mobile
      const appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      appleIcon.href = logoUrl;
      document.head.appendChild(appleIcon);
      
      console.log("Sistema de Favicon: Atualizado para", logoUrl);
    };

    // Executar imediatamente e após o carregamento completo
    forceUpdateFavicon();
    window.addEventListener('load', forceUpdateFavicon);
    
    // Tentativa extra após 3 segundos (estratégia para o Chrome persistente)
    const timer = setTimeout(forceUpdateFavicon, 3000);

    return () => {
      window.removeEventListener('load', forceUpdateFavicon);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-32 bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 space-y-16 py-8">
        <Hero />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section id="programacao">
              <Schedule />
            </section>
            
            <section id="parcerias">
              <Partnerships />
            </section>
          </div>
          
          <aside className="space-y-8">
            <GeminiAssistant />
            <VisitorCounter />
            <News />
            <Socials />
          </aside>
        </div>
      </main>

      <footer className="bg-gray-800 py-8 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Web Rádio Figueiró. Todos os direitos reservados.</p>
          <p className="mt-2">Email: <a href="mailto:webradiofigueiro@gmail.pt" className="hover:text-blue-400 transition-colors">webradiofigueiro@gmail.pt</a></p>
          <p>Telefone: +351 910270085</p>
          <p className="mt-2 text-xs">Desenvolvido para a melhor experiência auditiva.</p>
        </div>
      </footer>

      <Player />
    </div>
  );
};

export default App;