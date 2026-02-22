'use client';

import React from 'react';
import { useBuilder } from '@/context/BuilderContext';
import { MousePointerClick, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus, Trash2, ChevronDown, ChevronUp, Upload } from 'lucide-react';

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
  const { blocks, selectedBlockId, updateBlock, setSelectedBlock } = useBuilder();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const findBlockRecursive = (list: any[], id: string): any => {
    for (const b of list) {
      if (b.id === id) return b;
      if (b.children) {
        const found = findBlockRecursive(b.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const getParentId = (list: any[], id: string, currentParent?: string): string | undefined => {
    for (const b of list) {
       if (b.id === id) return currentParent;
       if (b.children) {
         const parent = getParentId(b.children, id, b.id);
         if (parent) return parent;
       }
    }
    return undefined;
  };

  const selectedBlock = selectedBlockId ? findBlockRecursive(blocks, selectedBlockId) : undefined;
  const parentId = selectedBlockId ? getParentId(blocks, selectedBlockId) : undefined;
  const isChildBlock = !!parentId;

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
  const hasBgColor = true; // All blocks support backgrounds now
  const hasBorderRadius = ['image', 'button', 'wa-button'].includes(selectedBlock.type);

  // EXCLUSIVE SECTION EDITOR
  if (selectedBlock.type === 'section') {
      const handleAddQuickElement = (type: string) => {
         const newBlock: any = {
           id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
           type,
           content: type === 'heading' ? 'New Heading' : type === 'paragraph' ? 'New text block' : type === 'button' ? 'Click Me' : '',
           layout: { x: 0, y: 0, w: 12, h: 2 },
           styles: {
             fontSize: type === 'heading' ? '2.5rem' : '1rem',
             fontWeight: type === 'heading' ? '800' : 'normal',
             color: '#000000',
             padding: type === 'button' ? '0.75rem 1.5rem' : '0',
           },
         };

         if (type === 'image') {
            newBlock.content = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
            newBlock.styles.borderRadius = '0.5rem';
         }

         const updatedChildren = [...(selectedBlock.children || []), newBlock];
         updateBlock(selectedBlock.id, { children: updatedChildren });
      };

      return (
         <div key={selectedBlock.id} className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editing Element</span>
                  <span className="text-sm font-bold text-gray-900 capitalize flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     Container (Section)
                  </span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
               <Accordion title="Background & Overlay" defaultOpen={true}>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Background Image Upload</label>
                        <div className="flex items-center gap-2">
                           <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (base64) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, backgroundImage: base64, backgroundSize: 'cover', backgroundPosition: 'center' } }))}
                              className="w-full text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-lg file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all shadow-sm cursor-pointer"
                           />
                           {selectedBlock.styles.backgroundImage && (
                              <button 
                                 onClick={() => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, backgroundImage: '' } })} 
                                 className="p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg border border-gray-200 transition-colors shadow-sm shrink-0"
                                 title="Remove Image"
                              >
                                 <Trash2 size={16} />
                              </button>
                           )}
                        </div>
                     </div>
                     <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Background Color</label>
                           <button 
                              onClick={() => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, backgroundColor: 'transparent' } })}
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
                                 onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, backgroundColor: e.target.value }})}
                                 className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                              />
                           </div>
                           <input
                              type="text"
                              value={selectedBlock.styles.backgroundColor || 'transparent'}
                              onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, backgroundColor: e.target.value }})}
                              className="flex-1 text-sm text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono uppercase"
                           />
                        </div>
                     </div>
                     <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Overlay Color</label>
                           <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 shrink-0 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                 <input
                                    type="color"
                                    value={selectedBlock.styles.overlayColor || '#000000'}
                                    onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, overlayColor: e.target.value }})}
                                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                 />
                              </div>
                              <input
                                 type="text"
                                 value={selectedBlock.styles.overlayColor || '#000000'}
                                 onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, overlayColor: e.target.value }})}
                                 className="flex-1 text-sm text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono uppercase"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <span>Overlay Opacity</span>
                              <span className="text-blue-600">{Math.round((selectedBlock.styles.overlayOpacity || 0) * 100)}%</span>
                           </label>
                           <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={selectedBlock.styles.overlayOpacity || 0}
                              onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, overlayOpacity: parseFloat(e.target.value) } })}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                           />
                        </div>
                     </div>
                  </div>
               </Accordion>

               <Accordion title="Layout Container (Flexbox)" defaultOpen={true}>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Direction</label>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                           <button
                              onClick={() => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, flexDirection: 'column' } })}
                              className={`flex-1 flex items-center justify-center py-2 text-xs font-semibold rounded-md transition-all ${(!selectedBlock.styles.flexDirection || selectedBlock.styles.flexDirection === 'column') ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                           >
                              Vertical (Column)
                           </button>
                           <button
                              onClick={() => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, flexDirection: 'row' } })}
                              className={`flex-1 flex items-center justify-center py-2 text-xs font-semibold rounded-md transition-all ${(selectedBlock.styles.flexDirection === 'row') ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                           >
                              Horizontal (Row)
                           </button>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alignment (Cross)</label>
                           <select
                              value={selectedBlock.styles.alignItems || 'center'}
                              onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, alignItems: e.target.value } })}
                              className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 bg-white focus:border-blue-500 transition-all shadow-sm"
                           >
                              <option value="flex-start">Start</option>
                              <option value="center">Center</option>
                              <option value="flex-end">End</option>
                              <option value="stretch">Stretch</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Justify (Main)</label>
                           <select
                              value={selectedBlock.styles.justifyContent || 'flex-start'}
                              onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, justifyContent: e.target.value } })}
                              className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 bg-white focus:border-blue-500 transition-all shadow-sm"
                           >
                              <option value="flex-start">Start</option>
                              <option value="center">Center</option>
                              <option value="flex-end">End</option>
                              <option value="space-between">Space Between</option>
                              <option value="space-around">Space Around</option>
                           </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gap</label>
                           <input
                              type="text"
                              value={selectedBlock.styles.gap || '1rem'}
                              onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, gap: e.target.value } })}
                              className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono shadow-sm"
                              placeholder="e.g. 16px or 1rem"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Padding</label>
                           <input
                              type="text"
                              value={selectedBlock.styles.padding || '2rem'}
                              onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, padding: e.target.value } })}
                              className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono shadow-sm"
                              placeholder="e.g. 24px"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest" title="Each row is roughly 30px on canvas">Height (Rows)</label>
                           <input
                              type="number"
                              min="5"
                              value={selectedBlock.layout?.h || 10}
                              onChange={(e) => {
                                 const val = parseInt(e.target.value) || 10;
                                 updateBlock(selectedBlock.id, { layout: { ...selectedBlock.layout, h: val } });
                              }}
                              className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono shadow-sm"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Min Height</label>
                           <input
                              type="text"
                              value={selectedBlock.styles.minHeight || 'auto'}
                              onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, minHeight: e.target.value } })}
                              className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono shadow-sm"
                              placeholder="e.g. 100vh or 500px"
                           />
                        </div>
                     </div>
                  </div>
               </Accordion>

               <Accordion title="Section Content (Layers)" defaultOpen={true}>
                  {(!selectedBlock.children || selectedBlock.children.length === 0) ? (
                     <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                        <p className="text-xs text-gray-500">No elements in this container.</p>
                     </div>
                  ) : (
                     <div className="space-y-2">
                        {selectedBlock.children.map((child: any, index: number) => {
                           let displayContent = child.content || '...';
                           if (displayContent.startsWith('data:image')) {
                              const commaIndex = displayContent.indexOf(',');
                              displayContent = commaIndex > -1 
                                 ? displayContent.substring(0, commaIndex + 2) + '.....' 
                                 : 'data:image/...';
                           } else if (displayContent.length > 40) {
                              displayContent = displayContent.substring(0, 40) + '...';
                           }

                           return (
                           <div 
                              key={child.id} 
                              className="flex items-center justify-between p-2 pl-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-all group"
                           >
                              <div 
                                 className="flex flex-col min-w-0 flex-1 cursor-pointer pr-2" 
                                 onClick={() => setSelectedBlock(child.id)}
                              >
                                 <span className="text-xs font-bold text-gray-800 capitalize truncate">{child.type}</span>
                                 <span className="text-[10px] text-gray-500 font-mono truncate">{displayContent}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                 <button 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       if (index === 0) return;
                                       const newChildren = [...(selectedBlock.children || [])];
                                       const temp = newChildren[index - 1];
                                       newChildren[index - 1] = newChildren[index];
                                       newChildren[index] = temp;
                                       updateBlock(selectedBlock.id, { children: newChildren });
                                    }}
                                    className={`p-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'shadow-sm'}`}
                                    title="Move Up"
                                 >
                                    <ChevronUp size={16} />
                                 </button>
                                 <button 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       if (index === (selectedBlock.children?.length || 0) - 1) return;
                                       const newChildren = [...(selectedBlock.children || [])];
                                       const temp = newChildren[index + 1];
                                       newChildren[index + 1] = newChildren[index];
                                       newChildren[index] = temp;
                                       updateBlock(selectedBlock.id, { children: newChildren });
                                    }}
                                    className={`p-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all ${index === (selectedBlock.children?.length || 0) - 1 ? 'opacity-30 cursor-not-allowed' : 'shadow-sm'}`}
                                    title="Move Down"
                                 >
                                    <ChevronDown size={16} />
                                 </button>
                                 <button 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       const newChildren = [...(selectedBlock.children || [])];
                                       newChildren.splice(index, 1);
                                       updateBlock(selectedBlock.id, { children: newChildren });
                                    }}
                                    className="p-1.5 bg-gray-50 border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-md transition-all shadow-sm ml-0.5"
                                    title="Delete Layer"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                           );
                        })}
                     </div>
                  )}
               </Accordion>

               <Accordion title="Quick Add Elements" defaultOpen={true}>
                  <div className="grid grid-cols-2 gap-2">
                     <button 
                        onClick={() => handleAddQuickElement('heading')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                     >
                        <Plus size={14} /> Add Heading
                     </button>
                     <button 
                        onClick={() => handleAddQuickElement('paragraph')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                     >
                        <Plus size={14} /> Add Text
                     </button>
                     <button 
                        onClick={() => handleAddQuickElement('button')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                     >
                        <Plus size={14} /> Add Button
                     </button>
                     <button 
                        onClick={() => handleAddQuickElement('image')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                     >
                        <Plus size={14} /> Add Image
                     </button>
                  </div>
               </Accordion>
            </div>
         </div>
      );
  }

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

        {/* Child Positioning Controls */}
        {isChildBlock && (
          <Accordion title="Position (Smart Container)" defaultOpen={true}>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer py-2 px-1 border-b border-gray-100 pb-4">
                <input 
                  type="checkbox" 
                  checked={selectedBlock.styles.isAbsolute || false}
                  onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, isAbsolute: e.target.checked } })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                />
                <div className="flex flex-col">
                   <span className="text-sm font-bold text-gray-700">Absolute Position</span>
                   <span className="text-[10px] text-gray-500">Freeform movement outside flexbox</span>
                </div>
              </label>

              {selectedBlock.styles.isAbsolute && (
                <>
                  <div className="space-y-2">
                    <label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <span>X Position (Horizontal)</span>
                      <span className="text-blue-600">{selectedBlock.styles.posX || 0}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedBlock.styles.posX || 0}
                      onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, posX: parseInt(e.target.value) } })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <span>Y Position (Vertical)</span>
                      <span className="text-blue-600">{selectedBlock.styles.posY || 0}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedBlock.styles.posY || 0}
                      onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, posY: parseInt(e.target.value) } })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </>
              )}
            </div>
          </Accordion>
        )}
        
        {/* Removed redundant layer manager for Sections as it's now handled entirely above */}
        
        {/* Type-Specific Settings (Sticky, Full Width) */}
        {selectedBlock.type === 'navbar' && (
          <Accordion title={`${selectedBlock.type} Settings`} defaultOpen={true}>
              <label className="flex items-center gap-3 cursor-pointer py-2 px-1">
                <input 
                  type="checkbox" 
                  checked={selectedBlock.styles.isSticky || false}
                  onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, isSticky: e.target.checked } })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all"
                />
                <span className="text-sm font-bold text-gray-700">Sticky Mode</span>
              </label>
          </Accordion>
        )}

        {/* Image Dimensions Panel */}
        {selectedBlock.type === 'image' && (
           <Accordion title="Image Dimensions" defaultOpen={true}>
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Width</label>
                       <input
                          type="text"
                          value={selectedBlock.styles.width || '100%'}
                          onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, width: e.target.value } })}
                          className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono shadow-sm"
                          placeholder="e.g. 100%, 300px"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Height</label>
                       <input
                          type="text"
                          value={selectedBlock.styles.height || '100%'}
                          onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, height: e.target.value } })}
                          className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono shadow-sm"
                          placeholder="e.g. 100%, 300px"
                       />
                    </div>
                 </div>
                 <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Image Fit (Scale)</label>
                    <select
                       value={selectedBlock.styles.objectFit || 'cover'}
                       onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, objectFit: e.target.value } })}
                       className="w-full text-xs text-gray-800 border border-gray-200 rounded-lg p-2 bg-white focus:border-blue-500 transition-all shadow-sm"
                    >
                       <option value="cover">Cover (Fill & Crop)</option>
                       <option value="contain">Contain (Fit Whole Image)</option>
                       <option value="fill">Fill (Stretch)</option>
                       <option value="none">None (Original Size)</option>
                       <option value="scale-down">Scale Down</option>
                    </select>
                 </div>
              </div>
           </Accordion>
        )}
        
        {/* Content Section (Always Open & Not in Accordion for quick access) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">
            {selectedBlock.type === 'image' ? 'Image File' : selectedBlock.type === 'navbar' ? 'Brand Name' : selectedBlock.type === 'wa-button' ? 'Button Label' : 'Content'}
          </label>
          
          {selectedBlock.type === 'paragraph' ? (
            <textarea
              value={selectedBlock.content}
              onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
              className="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[120px] resize-y shadow-sm"
              placeholder="Type your text here..."
            />
          ) : selectedBlock.type === 'image' ? (
            <input
               type="file"
               accept="image/*"
               onChange={(e) => handleImageUpload(e, (base64) => updateBlock(selectedBlock.id, { content: base64 }))}
               className="w-full text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-lg file:mr-3 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all shadow-sm cursor-pointer"
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
                selectedBlock.links.map((link: any, index: number) => (
                  <div key={link.id} className="flex gap-2 items-center p-3 bg-gray-50/50 border border-gray-200 rounded-xl group transition-all">
                    <div className="flex-1 flex flex-col gap-2">
                       <input
                         type="text"
                         value={link.label}
                         onChange={(e) => {
                           const newLinks = [...(selectedBlock.links || [])];
                           newLinks[index] = { ...newLinks[index], label: e.target.value };
                           updateBlock(selectedBlock.id, { links: newLinks });
                         }}
                         className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
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
                         className="w-full text-xs text-gray-500 font-mono border border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                         placeholder="Target URL (e.g. /home)"
                       />
                    </div>
                    <button
                      onClick={() => {
                        const newLinks = [...(selectedBlock.links || [])];
                        newLinks.splice(index, 1);
                        updateBlock(selectedBlock.id, { links: newLinks });
                      }}
                      className="p-2 shrink-0 h-full flex flex-col justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove link"
                    >
                      <Trash2 size={18} />
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

        {/* Menu Tabs Accordion */}
        {selectedBlock.type === 'menu-tabs' && (
          <Accordion title="Menu Categories & Items" defaultOpen={true}>
            <div className="space-y-4">
              {(!selectedBlock.menuTabs || selectedBlock.menuTabs.length === 0) ? (
                 <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                   <p className="text-xs text-gray-500">No menu categories added.</p>
                 </div>
              ) : (
                selectedBlock.menuTabs.map((cat: any, catIndex: number) => (
                  <div key={catIndex} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={cat.tab}
                        onChange={(e) => {
                          const newTabs = [...selectedBlock.menuTabs!];
                          newTabs[catIndex] = { ...cat, tab: e.target.value };
                          updateBlock(selectedBlock.id, { menuTabs: newTabs });
                        }}
                        className="w-full text-sm font-bold border border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Category Name (e.g. Coffee)"
                      />
                      <button
                        onClick={() => {
                          const newTabs = [...selectedBlock.menuTabs!];
                          newTabs.splice(catIndex, 1);
                          updateBlock(selectedBlock.id, { menuTabs: newTabs });
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                      {cat.items.map((item: any, itemIndex: number) => (
                         <div key={itemIndex} className="space-y-2 bg-white p-2 rounded-lg border border-gray-100 relative group">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newTabs = [...selectedBlock.menuTabs!];
                                newTabs[catIndex].items[itemIndex] = { ...item, name: e.target.value };
                                updateBlock(selectedBlock.id, { menuTabs: newTabs });
                              }}
                              className="w-full text-xs font-bold border border-gray-200 rounded px-2 py-1.5 focus:border-blue-500"
                              placeholder="Item Name"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={item.price}
                                onChange={(e) => {
                                  const newTabs = [...selectedBlock.menuTabs!];
                                  newTabs[catIndex].items[itemIndex] = { ...item, price: e.target.value };
                                  updateBlock(selectedBlock.id, { menuTabs: newTabs });
                                }}
                                className="w-1/3 text-xs border border-gray-200 rounded px-2 py-1.5 focus:border-blue-500"
                                placeholder="$4.00"
                              />
                              <input
                                type="text"
                                value={item.desc}
                                onChange={(e) => {
                                  const newTabs = [...selectedBlock.menuTabs!];
                                  newTabs[catIndex].items[itemIndex] = { ...item, desc: e.target.value };
                                  updateBlock(selectedBlock.id, { menuTabs: newTabs });
                                }}
                                className="flex-1 text-xs text-gray-500 border border-gray-200 rounded px-2 py-1.5 focus:border-blue-500"
                                placeholder="Description"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newTabs = [...selectedBlock.menuTabs!];
                                newTabs[catIndex].items.splice(itemIndex, 1);
                                updateBlock(selectedBlock.id, { menuTabs: newTabs });
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 bg-white shadow-sm rounded p-0.5 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                         </div>
                      ))}
                      <button
                        onClick={() => {
                          const newTabs = [...selectedBlock.menuTabs!];
                          newTabs[catIndex].items.push({ name: 'New Item', desc: 'Description', price: '$0.00' });
                          updateBlock(selectedBlock.id, { menuTabs: newTabs });
                        }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 mt-2"
                      >
                        <Plus size={14} /> Add Item
                      </button>
                    </div>
                  </div>
                ))
              )}
              
              <button
                onClick={() => {
                  const currentTabs = selectedBlock.menuTabs || [];
                  updateBlock(selectedBlock.id, { 
                    menuTabs: [...currentTabs, { tab: 'New Category', items: [] }]
                  });
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed py-2.5 rounded-xl transition-colors mt-2"
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Category
              </button>
            </div>
          </Accordion>
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
                  <option value="300">Light</option>
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

        {/* Background & Colors Accordion */}
        {(isTextType || hasBgColor) && (
          <Accordion title="Background & Colors" defaultOpen={false}>
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
            
            {/* Background Image and Overlay features available on all blocks if bg is enabled */}
            <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Image Background URL</label>
                <input
                  type="text"
                  value={selectedBlock.styles.bgImage || ''}
                  onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, bgImage: e.target.value } })}
                  className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono shadow-sm"
                  placeholder="e.g. https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2 pt-2 border-t border-gray-50 mt-4">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Background Size</label>
                <select
                  value={selectedBlock.styles.backgroundSize || 'cover'}
                  onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, backgroundSize: e.target.value } })}
                  className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-2.5 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                >
                  <option value="cover">Cover (Fill Area)</option>
                  <option value="contain">Contain (Fit Details)</option>
                </select>
              </div>
              <div className="space-y-2 pt-2 border-t border-gray-50 mt-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Overlay Color</label>
                  <button 
                    onClick={() => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, overlayColor: 'transparent' } })}
                    className="text-[10px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 shrink-0 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <input
                      type="color"
                      value={selectedBlock.styles.overlayColor || '#000000'}
                      onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, overlayColor: e.target.value }})}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedBlock.styles.overlayColor || '#000000'}
                    onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, overlayColor: e.target.value }})}
                    className="flex-1 text-sm text-gray-800 border border-gray-200 rounded-lg p-2 focus:border-blue-500 transition-all font-mono uppercase"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Overlay Opacity</span>
                  <span className="text-blue-600">{selectedBlock.styles.overlayOpacity || 0}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedBlock.styles.overlayOpacity || 0}
                  onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, overlayOpacity: parseInt(e.target.value) } })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
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