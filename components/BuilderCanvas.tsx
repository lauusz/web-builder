'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Heading, Trash2 } from 'lucide-react';
import { useBuilder } from '@/context/BuilderContext';
import { BlockRenderer } from '@/components/BlockRenderer';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const GridWrapper = dynamic(() => import('@/components/GridWrapper'), { ssr: false });

interface BuilderCanvasProps {
  isPreview: boolean;
  previewDevice: 'desktop' | 'mobile';
}

export function BuilderCanvas({ isPreview, previewDevice }: BuilderCanvasProps) {
  const { 
    blocks, 
    selectedBlockId, 
    updateBlockLayout,
    removeBlock, 
    setSelectedBlock 
  } = useBuilder();

  return (
    <main 
      className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-gray-50 relative"
      onClick={() => !isPreview && setSelectedBlock(null)}
    >
      <div className={`transition-all relative ${
        previewDevice === 'mobile' 
          ? 'mx-auto bg-white w-full max-w-[375px] min-h-[812px] shadow-2xl overflow-x-hidden ring-1 ring-gray-300 mt-8 mb-32'
          : 'max-w-full min-h-screen pb-32'
      }`}>
        {blocks.length === 0 ? (
          <div className="h-[80vh] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center p-12 max-w-lg w-full border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-3xl transition-colors hover:bg-gray-50 hover:border-gray-400">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm mb-6">
                <Heading size={32} className="text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start building your page</h3>
              {!isPreview ? (
                <p className="text-gray-500 text-sm">
                  Click on any block from the left sidebar to add it to your canvas. You can drag to resize or reposition them.
                </p>
              ) : (
                <p className="text-gray-500 text-sm">No content published yet.</p>
              )}
            </div>
          </div>
        ) : (
          <GridWrapper
            className="layout min-h-[500px]"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            compactType="vertical"
            preventCollision={false}
            onLayoutChange={(layout: any[]) => updateBlockLayout(layout)}
            isDraggable={!isPreview}
            isResizable={!isPreview}
          >
            {blocks.map((block) => {
              const isSelected = selectedBlockId === block.id && !isPreview;

              return (
                <div 
                  key={block.id}
                  data-grid={block.layout}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isPreview) setSelectedBlock(block.id);
                  }}
                  className={`relative group rounded-xl transition-all duration-300 flex flex-col ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white shadow-xl bg-blue-50/5 z-10' 
                      : isPreview 
                        ? 'ring-transparent' 
                        : 'ring-2 ring-transparent hover:ring-gray-300 hover:ring-offset-2 hover:ring-offset-white hover:bg-gray-50/50 cursor-pointer'
                  }`}
                  style={{}}
                >
                  {/* Hover Actions Float */}
                  {!isPreview && (
                    <div className={`absolute -top-3.5 -right-3.5 flex-col gap-1 p-1 bg-white border border-gray-200 shadow-lg rounded-full z-20 ${isSelected ? 'flex' : 'hidden group-hover:flex animate-in fade-in zoom-in duration-200'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
                        title="Delete Element"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}

                  {/* Render Content - FIXED: removed overflow-hidden here */}
                  <div className="flex-1 w-full h-full flex flex-col relative">
                    <BlockRenderer block={block} />
                  </div>
                </div>
              );
            })}
          </GridWrapper>
        )}
      </div>
    </main>
  );
}