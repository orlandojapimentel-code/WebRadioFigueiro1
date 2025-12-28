
import React from 'react';

const Socials: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 space-y-6">
      <h4 className="text-lg font-bold">Conecte-se Connosco</h4>
      <div className="grid grid-cols-3 gap-4">
        <a href="https://www.facebook.com//webradiofigueiro/" target="_blank" rel="noopener noreferrer" className="bg-blue-600/10 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-blue-600 transition-all group">
          <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
        </a>
        <a href="https://twitter.com/Orlando47524389" target="_blank" rel="noopener noreferrer" className="bg-sky-400/10 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-sky-400 transition-all group">
          <svg className="w-6 h-6 text-sky-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
        </a>
        <a href="https://www.youtube.com/channel/UClblcmnLHtfoLtUetuy483w" target="_blank" rel="noopener noreferrer" className="bg-red-600/10 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-red-600 transition-all group">
          <svg className="w-6 h-6 text-red-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
      </div>
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <a href="mailto:webradiofigueiro@gmail.pt" className="hover:text-blue-400 transition-colors">webradiofigueiro@gmail.pt</a>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </div>
          <span>+351 910270085</span>
        </div>
      </div>
    </div>
  );
};

export default Socials;
