
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
    const updateFavicon = () => {
      // 1. Limpar todos os links de ícone existentes no head
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach(el => el.parentNode?.removeChild(el));

      // 2. Criar novo link com caminho absoluto e versão dinâmica
      const logoPath = `/logo.png?v=${Date.now()}`;

      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = logoPath;
      document.head.appendChild(link);

      // 3. Adicionar Apple Touch Icon para dispositivos móveis
      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = logoPath;
      document.head.appendChild(appleLink);
      
      console.log("Favicon atualizado para:", logoPath);
    };

    updateFavicon();
    
    // Segunda tentativa após o carregamento total da página (estratégia para o Chrome)
    window.addEventListener('load', updateFavicon);
    return () => window.removeEventListener('load', updateFavicon);
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