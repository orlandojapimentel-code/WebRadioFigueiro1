
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
    const logoPath = "logo.png?v=12";
    
    const updateFavicons = () => {
      // Atualizar todos os links de ícone existentes
      const links = document.querySelectorAll("link[rel*='icon']");
      if (links.length > 0) {
        links.forEach((link: any) => {
          link.href = logoPath;
        });
      } else {
        // Criar se não existir
        const newIcon = document.createElement('link');
        newIcon.rel = 'icon';
        newIcon.type = 'image/png';
        newIcon.href = logoPath;
        document.head.appendChild(newIcon);
      }
    };

    updateFavicons();
    // Forçar atualização quando a janela carregar totalmente
    window.addEventListener('load', updateFavicons);
    return () => window.removeEventListener('load', updateFavicons);
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