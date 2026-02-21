'use client';

import React, { useState } from 'react';
import { BuilderProvider, useBuilder } from '@/context/BuilderContext';
import { BlockRenderer } from '@/components/BlockRenderer';
import { PropertyEditor } from '@/components/PropertyEditor';
import { 
  Heading, 
  Pilcrow, 
  Image as ImageIcon, 
  MousePointerClick, 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  Code,
  Eye,
  EyeOff,
  Navigation
} from 'lucide-react';

function BuilderInterface() {
  const { 
    blocks, 
    selectedBlockId, 
    addBlock, 
    moveBlock, 
    removeBlock, 
    setSelectedBlock 
  } = useBuilder();

  const [isPreview, setIsPreview] = useState(false);

  const hasNavbar = blocks.some((b) => b.type === 'navbar');

  const handlePreviewJSON = () => {
    alert(JSON.stringify(blocks, null, 2));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-gray-900 overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Block Builder MVP
          </h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePreviewJSON}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm active:scale-95"
          >
            <Code size={16} />
            Preview JSON
          </button>
          <button 
            onClick={() => {
              setIsPreview(!isPreview);
              if (!isPreview) setSelectedBlock(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95 border ${
              isPreview 
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                : 'bg-black text-white hover:bg-gray-800 border-transparent shadow-md'
            }`}
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreview ? 'Exit Preview' : 'Preview Mode'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Block Palette */}
        <aside 
          className={`w-64 border-r border-gray-200 bg-gray-50/50 flex flex-col p-5 shrink-0 overflow-y-auto transition-all duration-300 ${
            isPreview ? 'hidden' : 'block'
          }`}
        >
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">Add Blocks</h2>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => addBlock('navbar')} 
              disabled={hasNavbar}
              className={`flex items-center gap-3 w-full bg-white border border-gray-200 p-3 rounded-xl transition-all text-left group ${
                hasNavbar 
                  ? 'opacity-50 cursor-not-allowed grayscale' 
                  : 'hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className={`p-2.5 rounded-lg transition-all ${
                hasNavbar 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-110'
              }`}>
                <Navigation size={18} />
              </div>
              <span className={`font-semibold transition-colors ${
                hasNavbar ? 'text-gray-400' : 'text-gray-700 group-hover:text-indigo-700'
              }`}>
                {hasNavbar ? 'Navbar Added' : 'Add Navbar'}
              </span>
            </button>
            
            <button onClick={() => addBlock('heading')} className="flex items-center gap-3 w-full bg-white border border-gray-200 p-3 rounded-xl hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group">
              <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg group-hover:bg-blue-100 group-hover:scale-110 transition-all"><Heading size={18} /></div>
              <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">Add Heading</span>
            </button>
            <button onClick={() => addBlock('paragraph')} className="flex items-center gap-3 w-full bg-white border border-gray-200 p-3 rounded-xl hover:border-green-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group">
              <div className="bg-green-50 text-green-600 p-2.5 rounded-lg group-hover:bg-green-100 group-hover:scale-110 transition-all"><Pilcrow size={18} /></div>
              <span className="font-semibold text-gray-700 group-hover:text-green-700 transition-colors">Add Paragraph</span>
            </button>
            <button onClick={() => addBlock('image')} className="flex items-center gap-3 w-full bg-white border border-gray-200 p-3 rounded-xl hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group">
              <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg group-hover:bg-purple-100 group-hover:scale-110 transition-all"><ImageIcon size={18} /></div>
              <span className="font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">Add Image</span>
            </button>
            <button onClick={() => addBlock('button')} className="flex items-center gap-3 w-full bg-white border border-gray-200 p-3 rounded-xl hover:border-orange-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group">
              <div className="bg-orange-50 text-orange-600 p-2.5 rounded-lg group-hover:bg-orange-100 group-hover:scale-110 transition-all"><MousePointerClick size={18} /></div>
              <span className="font-semibold text-gray-700 group-hover:text-orange-700 transition-colors">Add Button</span>
            </button>
          </div>
        </aside>

        {/* Center Canvas */}
        <main 
          className={`flex-1 overflow-y-auto relative transition-colors duration-300 ${
            isPreview ? 'bg-white p-0' : 'bg-gray-100/50 p-8'
          }`}
          onClick={() => !isPreview && setSelectedBlock(null)}
        >
          <div className={`mx-auto transition-all ${
            isPreview 
              ? 'max-w-4xl min-h-full py-12 px-6' 
              : 'max-w-3xl bg-white min-h-[850px] shadow-sm rounded-xl outline outline-1 outline-gray-200 p-10 pb-32 mt-4'
          }`}>
            {blocks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-6 mt-40">
                <div className="bg-gray-50 border border-gray-200 p-8 rounded-full shadow-inner">
                  <Heading size={40} className="text-gray-300" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-medium text-gray-500">No blocks added yet.</p>
                  {!isPreview && <p className="text-sm">Click the buttons on the left sidebar to add your first block.</p>}
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {blocks.map((block) => {
                  const isSelected = selectedBlockId === block.id && !isPreview;

                  return (
                    <div 
                      key={block.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isPreview) setSelectedBlock(block.id);
                      }}
                      className={`relative group rounded-md outline transition-all duration-200 ${
                        isSelected 
                          ? 'outline-2 outline-blue-500 shadow-[0_4px_20px_-5px_rgba(59,130,246,0.3)] bg-blue-50/10' 
                          : isPreview 
                            ? 'outline-transparent hover:outline-transparent' 
                            : 'outline-2 outline-transparent hover:outline-gray-300 hover:bg-gray-50/50 cursor-pointer'
                      }`}
                      style={{
                        padding: block.styles?.backgroundColor !== 'transparent' && block.styles?.backgroundColor ? '1.5rem' : '0.5rem',
                        borderRadius: block.styles?.backgroundColor !== 'transparent' && block.styles?.backgroundColor ? '0.75rem' : '0.375rem',
                      }}
                    >
                      {/* Hover Actions Float */}
                      {!isPreview && (
                        <div className={`absolute -right-14 top-2 flex-col gap-1.5 p-1 bg-gray-900 border border-gray-700 shadow-xl rounded-lg z-20 ${isSelected ? 'flex' : 'hidden group-hover:flex animate-in fade-in zoom-in-95 duration-200'}`}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                            className="p-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                            className="p-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <div className="h-px bg-gray-700 mx-1 my-0.5"></div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                            className="p-1.5 text-red-400 hover:bg-red-900/50 hover:text-red-300 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      {/* Render Content */}
                      <BlockRenderer block={block} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

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
