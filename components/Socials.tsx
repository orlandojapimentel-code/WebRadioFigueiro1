
import React from 'react';

const Socials: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800/40 p-6 rounded-[2.5rem] border border-gray-200 dark:border-blue-500/20 shadow-xl space-y-6">
      <div className="border-b border-gray-100 dark:border-white/5 pb-4">
        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Conecte-se Connosco</h4>
        <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tighter mt-1">A rádio em todo o lado</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <a href="https://www.facebook.com/webradiofigueiro/" target="_blank" rel="noopener noreferrer" className="bg-blue-600/5 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-blue-600 transition-all group">
          <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
          <span className="text-[8px] font-black text-gray-500 group-hover:text-white mt-2 uppercase tracking-widest">Facebook</span>
        </a>
        
        <a href="https://www.instagram.com/webradiofigueiro/" target="_blank" rel="noopener noreferrer" className="bg-pink-600/5 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-gradient-to-tr hover:from-orange-500 hover:to-pink-600 transition-all group">
          <svg className="w-6 h-6 text-pink-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          <span className="text-[8px] font-black text-gray-500 group-hover:text-white mt-2 uppercase tracking-widest">Instagram</span>
        </a>

        <a href="https://www.tiktok.com/@orlando.pimentel976" target="_blank" rel="noopener noreferrer" className="bg-gray-900/5 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-black transition-all group border border-transparent hover:border-white/20">
          <svg className="w-6 h-6 text-slate-900 dark:text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-2.15.01-4.31.02-6.46V0z"/></svg>
          <span className="text-[8px] font-black text-gray-500 group-hover:text-white mt-2 uppercase tracking-widest">TikTok</span>
        </a>

        <a href="https://www.youtube.com/channel/UClblcmnLHtfoLtUetuy483w" target="_blank" rel="noopener noreferrer" className="bg-red-600/5 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-red-600 transition-all group">
          <svg className="w-6 h-6 text-red-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          <span className="text-[8px] font-black text-gray-500 group-hover:text-white mt-2 uppercase tracking-widest">YouTube</span>
        </a>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center space-x-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <a href="mailto:WEBRADIOFIGUEIRO@GMAIL.COM" className="hover:text-blue-500 transition-colors font-black tracking-widest text-[9px]">WEBRADIOFIGUEIRO@GMAIL.COM</a>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </div>
          <span className="font-bold">+351 910270085</span>
        </div>
      </div>
    </div>
  );
};

export default Socials;
