'use client';

import React from 'react';
import { useBuilder } from '@/context/BuilderContext';
import { MousePointerClick, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus, Trash2, ChevronDown } from 'lucide-react';

const Accordion = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  return (
    <details className="group border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden" open={defaultOpen}>
      {/* FIXED: Ditambahkan list-none dan [&::-webkit-details-marker]:hidden agar panah default browser hilang */}
      <summary className="flex cursor-pointer items-center justify-between bg-gray-50/80 px-4 py-3 font-semibold text-gray-800 list-none [&::-webkit-details-marker]:hidden hover:bg-gray-100 transition-colors">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{title}</span>
        {/* FIXED: Diganti menjadi komponen ChevronDown dari lucide-react dengan size={16} */}
        <ChevronDown size={16} className="text-gray-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="p-4 border-t border-gray-100 space-y-4 bg-white">
        {children}
      </div>
    </details>
  );
};

export function PropertyEditor() {
  const { blocks, selectedBlockId, updateBlock } = useBuilder();
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (!selectedBlockId || !selectedBlock) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 py-20 px-6 gap-5 h-full">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm">
          <MousePointerClick size={32} strokeWidth={1.5} className="text-gray-400" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-gray-800">No Element Selected</h3>
          <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Click on any block in the canvas to edit its properties.</p>
        </div>
      </div>
    );
  }

  const isTextType = ['heading', 'paragraph', 'button', 'navbar', 'wa-button'].includes(selectedBlock.type);
  const isAlignable = ['heading', 'paragraph', 'image', 'button', 'navbar', 'wa-button'].includes(selectedBlock.type);
  const hasBgColor = ['button', 'navbar', 'wa-button'].includes(selectedBlock.type);
  const hasBorderRadius = ['image', 'button', 'wa-button'].includes(selectedBlock.type);

  return (
    <div key={selectedBlock.id} className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editing Element</span>
          <span className="text-sm font-bold text-gray-900 capitalize flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {selectedBlock.type.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Content Section (Always Open & Not in Accordion for quick access) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">
            {selectedBlock.type === 'image' ? 'Image URL' : selectedBlock.type === 'navbar' ? 'Brand Name' : selectedBlock.type === 'wa-button' ? 'Button Label' : 'Content'}
          </label>
          
          {selectedBlock.type === 'paragraph' ? (
            <textarea
              value={selectedBlock.content}
              onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
              className="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[120px] resize-y shadow-sm"
              placeholder="Type your text here..."
            />
          ) : (
            <input
              type="text"
              value={selectedBlock.content}
              onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
              className="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
              placeholder="Enter content..."
            />
          )}

          {/* WhatsApp Specifics injected below content directly */}
          {selectedBlock.type === 'wa-button' && (
            <div className="space-y-4 pt-3 border-t border-gray-100 mt-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">Phone Number</label>
                <input
                  type="text"
                  value={selectedBlock.waData?.phone || ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { waData: { ...selectedBlock.waData, phone: e.target.value, message: selectedBlock.waData?.message || '' } })}
                  className="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono shadow-sm"
                  placeholder="e.g. 6281234567890"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">Prefill Message</label>
                <textarea
                  value={selectedBlock.waData?.message || ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { waData: { ...selectedBlock.waData, phone: selectedBlock.waData?.phone || '', message: e.target.value } })}
                  className="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all min-h-[80px] resize-y shadow-sm"
                  placeholder="Halo, saya mau pesan..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Navbar Links Accordion */}
        {selectedBlock.type === 'navbar' && (
          <>
          <Accordion title="Navigation Links" defaultOpen={true}>
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Link Spacing</label>
              <input
                type="text"
                value={selectedBlock.styles.linkSpacing || ''}
                onChange={(e) => updateBlock(selectedBlock.id, { styles: { linkSpacing: e.target.value } })}
                className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono shadow-sm"
                placeholder="e.g. 1.5rem, 24px"
              />
            </div>
            
            <div className="space-y-3">
              {(!selectedBlock.links || selectedBlock.links.length === 0) ? (
                <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                  <p className="text-xs text-gray-500">No links configuration.</p>
                </div>
              ) : (
                selectedBlock.links.map((link, index) => (
                  <div key={link.id} className="flex flex-col gap-2 p-3 bg-gray-50/50 border border-gray-200 rounded-xl relative group">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...(selectedBlock.links || [])];
                        newLinks[index] = { ...newLinks[index], label: e.target.value };
                        updateBlock(selectedBlock.id, { links: newLinks });
                      }}
                      className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Label (e.g. Home)"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...(selectedBlock.links || [])];
                        newLinks[index] = { ...newLinks[index], url: e.target.value };
                        updateBlock(selectedBlock.id, { links: newLinks });
                      }}
                      className="w-full text-xs text-gray-500 font-mono border border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Target URL (e.g. /home)"
                    />
                    <button
                      onClick={() => {
                        const newLinks = [...(selectedBlock.links || [])];
                        newLinks.splice(index, 1);
                        updateBlock(selectedBlock.id, { links: newLinks });
                      }}
                      className="absolute -top-2.5 -right-2.5 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Remove link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
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
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed py-2.5 rounded-xl transition-colors mt-2"
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Link
            </button>
          </Accordion>

          {/* CTA Button Accordion */}
          <Accordion title="Call to Action Button" defaultOpen={true}>
            {selectedBlock.navbarCta ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Button Label</label>
                  <input
                    type="text"
                    value={selectedBlock.navbarCta.label || ''}
                    onChange={(e) => updateBlock(selectedBlock.id, { navbarCta: { ...selectedBlock.navbarCta!, label: e.target.value } })}
                    className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                    placeholder="e.g. Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Button URL</label>
                  <input
                    type="text"
                    value={selectedBlock.navbarCta.url || ''}
                    onChange={(e) => updateBlock(selectedBlock.id, { navbarCta: { ...selectedBlock.navbarCta!, url: e.target.value } })}
                    className="w-full text-xs text-gray-500 font-mono border border-gray-200 rounded-lg p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                    placeholder="e.g. /signup"
                  />
                </div>
                <button
                  onClick={() => updateBlock(selectedBlock.id, { navbarCta: undefined })}
                  className="w-full text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 py-2 rounded-lg transition-colors"
                >
                  Remove CTA Button
                </button>
              </div>
            ) : (
              <button
                onClick={() => updateBlock(selectedBlock.id, { navbarCta: { label: 'Get Started', url: '#' } })}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed py-2.5 rounded-xl transition-colors"
              >
                <Plus size={16} strokeWidth={2.5} />
                Add CTA Button
              </button>
            )}
          </Accordion>
          </>
        )}

        {/* Styling Accordion */}
        <Accordion title="Design & Layout" defaultOpen={true}>
          {/* Segmented Alignment */}
          {isAlignable && (
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alignment</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {(['left', 'center', 'right', 'justify'] as const).map((align) => {
                  const currentAlign = selectedBlock.styles.textAlign || 'left';
                  const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : align === 'right' ? AlignRight : AlignJustify;
                  return (
                    <button
                      key={align}
                      onClick={() => updateBlock(selectedBlock.id, { styles: { textAlign: align } })}
                      className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all ${
                        currentAlign === align 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                      title={`${align} Align`}
                    >
                      <Icon size={18} strokeWidth={2.5} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Typography Details */}
          {isTextType && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Font Size</label>
                <input
                  type="text"
                  value={selectedBlock.styles.fontSize || ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { styles: { fontSize: e.target.value } })}
                  className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono shadow-sm"
                  placeholder="e.g. 1.25rem"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Weight</label>
                <select
                  value={selectedBlock.styles.fontWeight || ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { styles: { fontWeight: e.target.value } })}
                  className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                >
                  <option value="">Default</option>
                  <option value="normal">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="bold">Bold</option>
                  <option value="800">Extrabold</option>
                </select>
              </div>
            </div>
          )}

          {/* Border Radius */}
          {hasBorderRadius && (
            <div className="space-y-2 pt-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rounding (Border Radius)</label>
              <input
                type="text"
                value={selectedBlock.styles.borderRadius || ''}
                onChange={(e) => updateBlock(selectedBlock.id, { styles: { borderRadius: e.target.value } })}
                className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono shadow-sm"
                placeholder="e.g. 8px, 9999px"
              />
            </div>
          )}
        </Accordion>

        {/* Colors Accordion */}
        {(isTextType || hasBgColor) && (
          <Accordion title="Colors" defaultOpen={false}>
            {isTextType && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Text Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 shrink-0 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <input
                      type="color"
                      value={selectedBlock.styles.color || '#000000'}
                      onChange={(e) => updateBlock(selectedBlock.id, { styles: { color: e.target.value }})}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedBlock.styles.color || '#000000'}
                    onChange={(e) => updateBlock(selectedBlock.id, { styles: { color: e.target.value }})}
                    className="flex-1 text-sm text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono uppercase"
                  />
                </div>
              </div>
            )}

            {hasBgColor && (
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Background</label>
                  <button 
                    onClick={() => updateBlock(selectedBlock.id, { styles: { backgroundColor: 'transparent' } })}
                    className="text-[10px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Set Transparent
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 shrink-0 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <input
                      type="color"
                      value={selectedBlock.styles.backgroundColor === 'transparent' ? '#ffffff' : (selectedBlock.styles.backgroundColor || '#ffffff')}
                      onChange={(e) => updateBlock(selectedBlock.id, { styles: { backgroundColor: e.target.value }})}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedBlock.styles.backgroundColor || 'transparent'}
                    onChange={(e) => updateBlock(selectedBlock.id, { styles: { backgroundColor: e.target.value }})}
                    className="flex-1 text-sm text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono uppercase"
                  />
                </div>
              </div>
            )}
          </Accordion>
        )}

        {/* Global Spacing Accordion */}
        <Accordion title="Spacing (Box Model)" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Outer Margin</label>
              <input
                type="text"
                value={selectedBlock.styles.margin || ''}
                onChange={(e) => updateBlock(selectedBlock.id, { styles: { margin: e.target.value } })}
                className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono shadow-sm"
                placeholder="e.g. 1rem"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inner Padding</label>
              <input
                type="text"
                value={selectedBlock.styles.padding || ''}
                onChange={(e) => updateBlock(selectedBlock.id, { styles: { padding: e.target.value } })}
                className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono shadow-sm"
                placeholder="e.g. 1.5rem"
              />
            </div>
          </div>
        </Accordion>
        
      </div>
    </div>
  );
}