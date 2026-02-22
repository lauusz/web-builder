'use client';

import React from 'react';
import { 
  Heading, 
  Pilcrow, 
  Image as ImageIcon, 
  Navigation,
  MessageCircle,
  MousePointerClick,
  LayoutTemplate,
  Type,
  MousePointer2,
  Square,
  Menu
} from 'lucide-react';
import { useBuilder } from '@/context/BuilderContext';
import { BlockType } from '@/types/builder';

type ColorTheme = 'indigo' | 'emerald' | 'blue' | 'primary' | 'purple' | 'orange';

interface BlockDefinition {
  type: BlockType;
  label: string;
  description: string;
  icon: React.FC<any>;
  theme: ColorTheme;
}

const CATEGORIES: { title: string; icon: React.FC<any>; blocks: BlockDefinition[] }[] = [
  {
    title: 'Layout & Structure',
    icon: LayoutTemplate,
    blocks: [
      { type: 'section', label: 'Section', description: 'Full width container', icon: Square, theme: 'indigo' },
      { type: 'navbar', label: 'Navigation Bar', description: 'Top header with links', icon: Navigation, theme: 'blue' },
    ]
  },
  {
    title: 'Typography',
    icon: Type,
    blocks: [
      { type: 'heading', label: 'Heading', description: 'Large section title', icon: Heading, theme: 'purple' },
      { type: 'paragraph', label: 'Text Block', description: 'Standard paragraph text', icon: Pilcrow, theme: 'primary' },
    ]
  },
  {
    title: 'Interactive & Media',
    icon: MousePointer2,
    blocks: [
      { type: 'image', label: 'Image', description: 'Responsive picture block', icon: ImageIcon, theme: 'emerald' },
      { type: 'button', label: 'Action Button', description: 'Clickable CTA link', icon: MousePointerClick, theme: 'orange' },
      { type: 'wa-button', label: 'WhatsApp', description: 'Direct chat button', icon: MessageCircle, theme: 'emerald' },
      { type: 'menu-tabs', label: 'Menu Tabs', description: 'Categorized item list', icon: Menu, theme: 'indigo' },
    ]
  }
];

const THEME_STYLES: Record<ColorTheme, { border: string; bg: string; text: string; groupBg: string; groupText: string }> = {
  indigo: { border: 'hover:border-indigo-300 hover:ring-indigo-100', bg: 'bg-indigo-50', text: 'text-indigo-600', groupBg: 'group-hover:bg-indigo-600', groupText: 'group-hover:text-white' },
  emerald: { border: 'hover:border-emerald-300 hover:ring-emerald-100', bg: 'bg-emerald-50', text: 'text-emerald-600', groupBg: 'group-hover:bg-emerald-500', groupText: 'group-hover:text-white' },
  blue: { border: 'hover:border-blue-300 hover:ring-blue-100', bg: 'bg-blue-50', text: 'text-blue-600', groupBg: 'group-hover:bg-blue-600', groupText: 'group-hover:text-white' },
  primary: { border: 'hover:border-gray-400 hover:ring-gray-200', bg: 'bg-gray-100', text: 'text-gray-700', groupBg: 'group-hover:bg-gray-800', groupText: 'group-hover:text-white' },
  purple: { border: 'hover:border-purple-300 hover:ring-purple-100', bg: 'bg-purple-50', text: 'text-purple-600', groupBg: 'group-hover:bg-purple-600', groupText: 'group-hover:text-white' },
  orange: { border: 'hover:border-orange-300 hover:ring-orange-100', bg: 'bg-orange-50', text: 'text-orange-600', groupBg: 'group-hover:bg-orange-500', groupText: 'group-hover:text-white' },
};

interface BuilderSidebarProps {
  isPreview: boolean;
}

export function BuilderSidebar({ isPreview }: BuilderSidebarProps) {
  const { blocks, addBlock, selectedBlockId } = useBuilder();
  const hasNavbar = blocks.some((b) => b.type === 'navbar');
  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  const targetParentId = activeBlock?.type === 'section' ? activeBlock.id : undefined;

  if (isPreview) return null;

  return (
    <aside className="w-[300px] border-r border-gray-200 bg-white flex flex-col shrink-0 overflow-y-auto z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Blocks</h2>
        <p className="text-sm text-gray-500 mt-1">Click to add elements</p>
      </div>
      
      <div className="flex-1 w-full px-4 pb-8 space-y-6 overflow-y-auto">
        {CATEGORIES.map((category, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <category.icon size={14} className="text-gray-400" />
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{category.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5">
              {category.blocks.map(({ type, label, description, icon: Icon, theme }) => {
                const isDisabled = type === 'navbar' && hasNavbar;
                const styles = THEME_STYLES[theme];
                
                return (
                  <button 
                    key={type}
                    onClick={() => addBlock(type, targetParentId)}
                    disabled={isDisabled}
                    className={`flex items-start gap-3 w-full bg-white border border-gray-100 p-3 rounded-xl transition-all duration-200 text-left group hover:ring-4 ${
                      isDisabled
                        ? 'opacity-40 cursor-not-allowed bg-gray-50' 
                        : styles.border + ' shadow-sm hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 transition-colors duration-200 ${
                      isDisabled 
                        ? 'bg-gray-200 text-gray-400' 
                        : styles.bg + ' ' + styles.text + ' ' + styles.groupBg + ' ' + styles.groupText
                    }`}>
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col pt-0.5 min-w-0">
                      <span className={`text-sm font-semibold truncate transition-colors ${
                        isDisabled ? 'text-gray-500' : 'text-gray-900 group-hover:text-black'
                      }`}>
                        {label}
                      </span>
                      <span className="text-xs text-gray-500 truncate mt-0.5">
                        {isDisabled && type === 'navbar' ? 'Only one per page' : description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
