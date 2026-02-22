'use client';

import React, { useState } from 'react';
import { BuilderProvider } from '@/context/BuilderContext';
import { PropertyEditor } from '@/components/PropertyEditor';
import { BuilderHeader } from '@/components/BuilderHeader';
import { BuilderSidebar } from '@/components/BuilderSidebar';
import { BuilderCanvas } from '@/components/BuilderCanvas';

function BuilderInterface() {
  const [isPreview, setIsPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="flex flex-col h-screen w-full bg-white text-gray-900 overflow-hidden font-sans">
      <BuilderHeader 
        isPreview={isPreview} 
        setIsPreview={setIsPreview} 
        previewDevice={previewDevice} 
        setPreviewDevice={setPreviewDevice} 
      />

      {/* Main Content Area */}
      <div className="flex h-screen w-full overflow-hidden bg-white">
        <BuilderSidebar isPreview={isPreview} />
        <BuilderCanvas isPreview={isPreview} previewDevice={previewDevice} />

        {/* Right Sidebar - Property Editor */}
        {!isPreview && (
          <aside className="w-[340px] border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-y-auto shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] z-20">
            <div className="p-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Property Editor</h2>
            </div>
            <div className="p-6">
              <PropertyEditor />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <BuilderProvider>
      <BuilderInterface />
    </BuilderProvider>
  );
}
