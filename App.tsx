import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentRenderer } from './components/ContentRenderer';
import { documentData } from './data/documentContent';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<string>(documentData[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeSection = documentData.find(s => s.id === activeSectionId) || documentData[0];

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex items-center justify-between shadow-sm">
        <span className="font-bold text-slate-800">Bosen AI Docs</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="bg-white w-64 h-full shadow-xl" onClick={e => e.stopPropagation()}>
             <Sidebar 
               sections={documentData} 
               activeSection={activeSectionId} 
               onSelectSection={(id) => {
                 setActiveSectionId(id);
                 setIsMobileMenuOpen(false);
                 window.scrollTo(0,0);
               }} 
             />
           </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar 
        sections={documentData} 
        activeSection={activeSectionId} 
        onSelectSection={(id) => {
          setActiveSectionId(id);
          window.scrollTo(0,0);
        }} 
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 mt-12 md:mt-0 max-w-5xl mx-auto">
        <header className="mb-8 pb-6 border-b border-slate-200">
           <div className="flex items-center gap-3 text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">
             Specification Document
             <span>/</span>
             v1.0
           </div>
           <h1 className="text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
             {activeSection.title}
           </h1>
        </header>
        
        <div className="animate-fade-in space-y-2">
          {activeSection.blocks.map((block, index) => (
            <ContentRenderer key={index} block={block} />
          ))}
        </div>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>System Specification generated for Internal Review.</p>
          <p>© {new Date().getFullYear()} BSSMC Group / Bosen AI Dev Team.</p>
        </footer>
      </main>
    </div>
  );
}