import React from 'react';
import { SectionType, ContentBlock } from '../types';
import { CheckCircle2, ArrowRight, Database, Server, Terminal, Sparkles } from 'lucide-react';
import { ImageEditor } from './ImageEditor';

interface BlockProps {
  block: ContentBlock;
}

export const ContentRenderer: React.FC<BlockProps> = ({ block }) => {
  switch (block.type) {
    case SectionType.TEXT:
      return (
        <div className="mb-6">
          {block.title && <h3 className="text-lg font-semibold text-slate-800 mb-2">{block.title}</h3>}
          <p className="text-slate-600 leading-relaxed text-base">
            {block.content}
          </p>
        </div>
      );

    case SectionType.LIST:
      return (
        <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
          {block.title && <h3 className="text-lg font-semibold text-slate-800 mb-4">{block.title}</h3>}
          <ul className="space-y-3">
            {(block.content as string[]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case SectionType.CODE:
      return (
        <div className="mb-8">
           {block.title && <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><Terminal className="w-4 h-4"/> {block.title}</h3>}
          <div className="bg-[#1e293b] rounded-lg overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700">
              <span className="text-xs text-slate-400 font-mono">{block.language}</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-slate-300">
                {block.code}
              </code>
            </pre>
          </div>
        </div>
      );

    case SectionType.TABLE:
      return (
        <div className="mb-8">
           {block.title && <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><Database className="w-4 h-4"/> {block.title}</h3>}
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  {block.data.headers.map((header: string, i: number) => (
                    <th key={i} className="px-6 py-3">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {block.data.rows.map((row: any[], i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    {row.map((cell: any, j: number) => (
                      <td key={j} className={`px-6 py-3 ${j === 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case SectionType.ARCHITECTURE:
      return (
        <div className="mb-8">
          {block.title && <h3 className="text-lg font-semibold text-slate-800 mb-4">{block.title}</h3>}
          <div className="flex flex-col gap-4">
            {block.data.layers.map((layer: any, idx: number) => (
              <div 
                key={idx} 
                className={`p-4 rounded-lg border-2 border-dashed ${layer.highlight ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 bg-white'}`}
              >
                <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">{layer.name}</div>
                <div className="flex flex-wrap gap-3">
                  {layer.items.map((item: string, i: number) => (
                    <div key={i} className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded text-sm font-medium text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case SectionType.API:
        return (
          <div className="mb-8 space-y-4">
             {block.title && <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2"><Server className="w-4 h-4"/> {block.title}</h3>}
            {block.data.map((ep: any, idx: number) => (
              <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm text-slate-700">{ep.path}</span>
                  <span className="ml-auto text-xs text-slate-500">{ep.summary}</span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-1">REQUEST BODY</div>
                      <pre className="bg-slate-900 text-slate-300 p-2 rounded text-xs font-mono overflow-x-auto">
                        {ep.request}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-1">RESPONSE</div>
                      <pre className="bg-slate-900 text-slate-300 p-2 rounded text-xs font-mono overflow-x-auto">
                        {ep.response}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case SectionType.FLOW:
        return (
          <div className="mb-8">
            {block.title && <h3 className="text-lg font-semibold text-slate-800 mb-6">{block.title}</h3>}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
              <div className="space-y-6">
                {block.data.steps.map((step: any, idx: number) => (
                  <div key={idx} className="relative flex items-center gap-4 pl-4">
                     <div className="absolute left-[11px] w-3 h-3 rounded-full border-2 border-white bg-blue-500 shadow-sm z-10"></div>
                     <div className="flex-1 bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-colors">
                        <span className="font-medium text-slate-700">{step.label}</span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case SectionType.IMAGE_EDITOR:
        return (
          <div className="mb-8">
            {block.title && <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-600"/> {block.title}</h3>}
            <ImageEditor />
          </div>
        );

    default:
      return null;
  }
};