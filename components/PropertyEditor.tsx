'use client';

import React from 'react';
import { useBuilder } from '@/context/BuilderContext';
import { MousePointerClick } from 'lucide-react';

export function PropertyEditor() {
  const { blocks, selectedBlockId, updateBlock } = useBuilder();
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (!selectedBlockId || !selectedBlock) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 py-16 gap-4">
        <div className="bg-gray-50 p-4 rounded-full border border-gray-100 shadow-sm">
          <MousePointerClick size={28} className="text-gray-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-700">No Block Selected</h3>
          <p className="text-sm">Click any block on the canvas to edit its properties.</p>
        </div>
      </div>
    );
  }

  return (
    <div key={selectedBlock.id} className="space-y-8">
      {/* Block Type Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-600">Block Type</span>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
          {selectedBlock.type}
        </span>
      </div>

      {/* Global Spacing Controls */}
      <div className="space-y-4 bg-gray-50/50 p-5 -mx-2 rounded-xl border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Spacing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Margin</label>
            <input
              type="text"
              value={selectedBlock.styles.margin || ''}
              onChange={(e) => updateBlock(selectedBlock.id, { styles: { margin: e.target.value } })}
              className="w-full text-sm text-gray-800 border-2 border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 transition-all font-mono"
              placeholder="e.g. 1rem, 20px"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Padding</label>
            <input
              type="text"
              value={selectedBlock.styles.padding || ''}
              onChange={(e) => updateBlock(selectedBlock.id, { styles: { padding: e.target.value } })}
              className="w-full text-sm text-gray-800 border-2 border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 transition-all font-mono"
              placeholder="e.g. 1.5rem, 24px"
            />
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-3 lg:space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {selectedBlock.type === 'image' ? 'Image Source URL' : selectedBlock.type === 'navbar' ? 'Brand Name' : 'Content Document'}
        </label>
        {selectedBlock.type === 'paragraph' ? (
          <textarea
            value={selectedBlock.content}
            onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
            className="w-full text-sm text-gray-800 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[160px] resize-y"
            placeholder="Type paragraph text here..."
          />
        ) : (
          <input
            type="text"
            value={selectedBlock.content}
            onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
            className="w-full text-sm text-gray-800 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            placeholder={`Enter ${selectedBlock.type} content...`}
          />
        )}
      </div>

      {/* Navbar Links Editor */}
      {selectedBlock.type === 'navbar' && (
        <div className="space-y-4 border-t border-gray-100 pt-5 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Navigation Links</h3>
            <button
              onClick={() => {
                const currentLinks = selectedBlock.links || [];
                updateBlock(selectedBlock.id, { 
                  links: [...currentLinks, { 
                    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9), 
                    label: 'New Link', 
                    url: '#' 
                  }] 
                });
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
            >
              + Add Link
            </button>
          </div>
          
          <div className="space-y-3">
            {(!selectedBlock.links || selectedBlock.links.length === 0) ? (
              <p className="text-xs text-gray-500 italic">No links added. Click "+ Add Link" to create one.</p>
            ) : (
              selectedBlock.links.map((link, index) => (
                <div key={link.id} className="flex flex-col gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg relative group">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...(selectedBlock.links || [])];
                        newLinks[index] = { ...newLinks[index], label: e.target.value };
                        updateBlock(selectedBlock.id, { links: newLinks });
                      }}
                      className="flex-1 text-sm border-2 border-gray-200 rounded-md p-1.5 focus:border-blue-500 focus:outline-none"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...(selectedBlock.links || [])];
                        newLinks[index] = { ...newLinks[index], url: e.target.value };
                        updateBlock(selectedBlock.id, { links: newLinks });
                      }}
                      className="flex-1 text-sm border-2 border-gray-200 rounded-md p-1.5 focus:border-blue-500 focus:outline-none"
                      placeholder="URL"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newLinks = [...(selectedBlock.links || [])];
                      newLinks.splice(index, 1);
                      updateBlock(selectedBlock.id, { links: newLinks });
                    }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Remove link"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Styling Options */}
      <div className="space-y-5 bg-gray-50/50 p-5 -mx-2 rounded-xl border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Styling</h3>
        
        {/* Text Alignment */}
        {['heading', 'paragraph', 'image', 'button', 'navbar'].includes(selectedBlock.type) && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Alignment</label>
            <div className="relative">
              <select
                value={selectedBlock.styles.textAlign || 'left'}
                onChange={(e) => updateBlock(selectedBlock.id, { 
                  styles: { textAlign: e.target.value as 'left' | 'center' | 'right' | 'justify' }
                })}
                className="w-full text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl p-3 appearance-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
              >
                <option value="left">Left Align</option>
                <option value="center">Center Align</option>
                <option value="right">Right Align</option>
                <option value="justify">Justify Text</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        )}

        {/* Text Color */}
        {['heading', 'paragraph', 'button', 'navbar'].includes(selectedBlock.type) && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Text Color</label>
            <div className="flex gap-3">
              <div className="relative w-12 h-12 shrink-0 rounded-xl border-2 border-gray-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <input
                  type="color"
                  value={selectedBlock.styles.color || '#000000'}
                  onChange={(e) => updateBlock(selectedBlock.id, { 
                    styles: { color: e.target.value }
                  })}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={selectedBlock.styles.color || '#000000'}
                onChange={(e) => updateBlock(selectedBlock.id, { 
                  styles: { color: e.target.value }
                })}
                className="flex-1 w-full text-sm font-medium text-gray-700 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all uppercase font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        )}

        {/* Background Color */}
        {['button', 'navbar'].includes(selectedBlock.type) && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Background</label>
            <div className="flex gap-3">
              <div className="relative w-12 h-12 shrink-0 rounded-xl border-2 border-gray-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <input
                  type="color"
                  value={selectedBlock.styles.backgroundColor === 'transparent' ? '#ffffff' : (selectedBlock.styles.backgroundColor || '#ffffff')}
                  onChange={(e) => updateBlock(selectedBlock.id, { 
                    styles: { backgroundColor: e.target.value }
                  })}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={selectedBlock.styles.backgroundColor || 'transparent'}
                onChange={(e) => updateBlock(selectedBlock.id, { 
                  styles: { backgroundColor: e.target.value }
                })}
                className="flex-1 w-full text-sm font-medium text-gray-700 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all uppercase font-mono"
                placeholder="transparent or #hex"
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => updateBlock(selectedBlock.id, { styles: { backgroundColor: 'transparent' } })}
                className="text-xs font-medium text-gray-500 hover:text-black bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm transition-colors active:scale-95"
              >
                Clear Background
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
