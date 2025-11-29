import React from 'react';
import { DocumentSection } from '../types';

interface SidebarProps {
  sections: DocumentSection[];
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, onSelectSection }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 overflow-y-auto hidden md:block z-10">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-800">Bosen AI Spec</h1>
        <p className="text-xs text-slate-500 mt-1">v1.0.0 | Release</p>
      </div>
      <nav className="p-4 space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={activeSection === section.id ? 'text-blue-600' : 'text-slate-400'}>
              {section.icon}
            </span>
            <span className="truncate">{section.title.split(' (')[0]}</span>
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-slate-50">
        <div className="text-xs text-slate-400 font-mono">
          BSSMC PROPERTY
          <br />
          STRICTLY CONFIDENTIAL
        </div>
      </div>
    </aside>
  );
};