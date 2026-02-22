'use client';

import React from 'react';
import { Download, Code, Eye, EyeOff, Monitor, Smartphone, Layout } from 'lucide-react';
import { useBuilder } from '@/context/BuilderContext';
import { exportToHTML } from '@/utils/exportHtml';

interface BuilderHeaderProps {
  isPreview: boolean;
  setIsPreview: (val: boolean) => void;
  previewDevice: 'desktop' | 'mobile';
  setPreviewDevice: (val: 'desktop' | 'mobile') => void;
}

export function BuilderHeader({ isPreview, setIsPreview, previewDevice, setPreviewDevice }: BuilderHeaderProps) {
  const { blocks, setSelectedBlock } = useBuilder();

  const handlePreviewJSON = () => {
    alert(JSON.stringify(blocks, null, 2));
  };

  const handleExport = () => {
    exportToHTML(blocks);
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-white shadow-sm shrink-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.3)]">
          <Layout size={16} strokeWidth={2.5} className="text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 whitespace-nowrap">
          Block Builder MVP
        </h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Device Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
              previewDevice === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
              previewDevice === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-700 rounded-lg hover:bg-green-700 transition-all shadow-sm active:scale-95 whitespace-nowrap"
        >
          <Download size={16} />
          Export HTML
        </button>

        <button 
          onClick={handlePreviewJSON}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm active:scale-95 whitespace-nowrap"
        >
          <Code size={16} />
          Preview JSON
        </button>

        <button 
          onClick={() => {
            setIsPreview(!isPreview);
            if (!isPreview) setSelectedBlock(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 border whitespace-nowrap ${
            isPreview 
              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent shadow-[0_2px_10px_rgba(79,70,229,0.2)]'
          }`}
        >
          {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          {isPreview ? 'Exit Preview' : 'Preview Mode'}
        </button>
      </div>
    </header>
  );
}