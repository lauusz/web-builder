'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Block, BlockType } from '@/types/builder';

function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 9);
}

interface BuilderContextType {
  blocks: Block[];
  selectedBlockId: string | null;
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  updateBlockLayout: (newLayoutData: any[]) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  removeBlock: (id: string) => void;
  setSelectedBlock: (id: string | null) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('builder_state');
    if (saved) {
      try {
        setBlocks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse builder_state', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('builder_state', JSON.stringify(blocks));
    }
  }, [blocks, isInitialized]);

  const addBlock = (type: BlockType) => {
    let defaultContent = '';
    let defaultLinks: typeof newBlock.links = undefined;
    let defaultNavbarCta: typeof newBlock.navbarCta = undefined;
    let defaultWaData: typeof newBlock.waData = undefined;
    
    if (type === 'heading') defaultContent = 'New Heading';
    else if (type === 'paragraph') defaultContent = 'New Paragraph';
    else if (type === 'button') defaultContent = 'Click Me';
    else if (type === 'image') defaultContent = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
    else if (type === 'navbar') {
      defaultContent = 'YourBrand';
      defaultLinks = [
        { id: generateId(), label: 'Home', url: '#' },
        { id: generateId(), label: 'Features', url: '#features' },
        { id: generateId(), label: 'Pricing', url: '#pricing' },
        { id: generateId(), label: 'About', url: '#about' },
        { id: generateId(), label: 'Contact', url: '#contact' },
      ];
      defaultNavbarCta = { label: 'Get Started', url: '#' };
    } else if (type === 'wa-button') {
      defaultContent = 'Chat via WhatsApp';
      defaultWaData = { phone: '6281234567890', message: 'Halo, saya tertarik dengan produk Anda.' };
    }

    const newBlock: Block = {
      id: generateId(),
      type,
      content: defaultContent,
      links: defaultLinks,
      navbarCta: defaultNavbarCta,
      waData: defaultWaData,
      layout: { x: 0, y: Infinity, w: 12, h: type === 'navbar' ? 3 : type === 'image' ? 6 : 4 },
      styles: {
        textAlign: 'left',
        color: type === 'navbar' ? '#ffffff' : type === 'wa-button' ? '#ffffff' : '#000000',
        backgroundColor: type === 'navbar' ? '#111827' : type === 'wa-button' ? '#25D366' : 'transparent',
        padding: type === 'navbar' ? '0.75rem 1.5rem' : undefined,
        linkSpacing: type === 'navbar' ? '2rem' : undefined,
        fontSize: type === 'navbar' ? '0.875rem' : undefined,
      },
    };
    
    // Add to bottom
    setBlocks((prev) => [...prev, newBlock]);
    
    // Automatically select newly added block
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          ...updates,
          styles: { ...b.styles, ...(updates.styles || {}) },
        };
      })
    );
  };

  const updateBlockLayout = (newLayoutData: any[]) => {
    setBlocks((prev) =>
      prev.map((block) => {
        const matchingLayout = newLayoutData.find((l) => l.i === block.id);
        if (matchingLayout) {
          return {
            ...block,
            layout: {
              x: matchingLayout.x,
              y: matchingLayout.y,
              w: matchingLayout.w,
              h: matchingLayout.h,
            },
          };
        }
        return block;
      })
    );
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        const newBlocks = [...prev];
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
        return newBlocks;
      }
      if (direction === 'down' && index < prev.length - 1) {
        const newBlocks = [...prev];
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        return newBlocks;
      }
      return prev;
    });
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  return (
    <BuilderContext.Provider 
      value={{ 
        blocks, 
        selectedBlockId, 
        addBlock, 
        updateBlock, 
        updateBlockLayout,
        moveBlock, 
        removeBlock, 
        setSelectedBlock: setSelectedBlockId 
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
