import React, { useState } from 'react';
import { Block } from '@/types/builder';
import { useBuilder } from '@/context/BuilderContext';

const DraggableChildWrapper = ({ 
  child, 
  parentId, 
  isPreview 
}: { 
  child: Block, 
  parentId: string, 
  isPreview?: boolean 
}) => {
  const { updateBlock } = useBuilder();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isAbs = child.styles.isAbsolute;
  
  // Use local state while dragging for 60fps smoothness without context re-renders
  const currentX = isAbs ? (child.styles.posX ?? 50) : 50;
  const currentY = isAbs ? (child.styles.posY ?? 50) : 50;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPreview) return;
    // Only drag on left click
    if (e.button !== 0) return;
    
    // Prevent dragging if clicking inside an interactive child like a button or input
    if ((e.target as HTMLElement).closest('button, input, textarea, a')) return;

    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);

    // Initial offset records the mouse position relative to the element's top-left
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Ensure it's marked as absolute immediately on drag start if it wasn't
    if (!isAbs) {
      updateBlock(child.id, { styles: { ...child.styles, isAbsolute: true }});
    }

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isPreview || !containerRef.current) return;
    
    e.stopPropagation();
    e.preventDefault();

    // The boundary is the Section wrapper
    const parentRect = containerRef.current.parentElement!.getBoundingClientRect();
    
    // Calculate new position relative to parent
    const newLeftPx = e.clientX - dragOffset.x - parentRect.left;
    const newTopPx = e.clientY - dragOffset.y - parentRect.top;

    // Convert pixel exact coordinate to percentage based off Section size
    // Note: Since element is translated -50% -50% by default, the origin is the CENTER of the element,
    // so we must account for half its width/height to get the visual center %.
    const elementRect = containerRef.current.getBoundingClientRect();
    const centerX_Px = newLeftPx + (elementRect.width / 2);
    const centerY_Px = newTopPx + (elementRect.height / 2);

    let pctX = Math.round((centerX_Px / parentRect.width) * 100);
    let pctY = Math.round((centerY_Px / parentRect.height) * 100);

    // Clamp values so it doesn't fly off screen
    pctX = Math.max(0, Math.min(100, pctX));
    pctY = Math.max(0, Math.min(100, pctY));

    // Fast local update via DOM to prevent React re-renders while dragging
    containerRef.current.style.left = `${pctX}%`;
    containerRef.current.style.top = `${pctY}%`;
    
    // Store it on the dataset for the PointerUp commit
    containerRef.current.dataset.x = pctX.toString();
    containerRef.current.style.transform = `translate(-50%, -50%) ${isDragging ? 'scale(1.02)' : 'scale(1)'}`;
    containerRef.current.dataset.y = pctY.toString();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (containerRef.current) {
        containerRef.current.style.transform = 'translate(-50%, -50%)';
        const finalX = parseInt(containerRef.current.dataset.x || currentX.toString());
        const finalY = parseInt(containerRef.current.dataset.y || currentY.toString());
        
        // Commit final coordinates to BuilderContext
        updateBlock(child.id, { 
            styles: { 
                ...child.styles, 
                isAbsolute: true, 
                posX: finalX, 
                posY: finalY 
            }
        });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`pointer-events-auto ${isAbs || isDragging ? 'absolute' : 'relative'} ${isDragging ? 'cursor-grabbing z-[100] shadow-2xl opacity-90' : isPreview ? '' : 'cursor-grab hover:ring-2 hover:ring-indigo-400/50 rounded-xl transition-shadow'}`}
      style={{
        width: child.type === 'navbar' ? '100%' : 'auto',
        zIndex: child.type === 'navbar' ? 50 : (isDragging ? 100 : 1),
        ...(isAbs || isDragging ? {
          left: `${currentX}%`,
          top: `${currentY}%`,
          transform: `translate(-50%, -50%)`,
          touchAction: 'none' // Required for pointer events to fire correctly on touch devices
        } : {})
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <BlockRenderer block={child} isPreview={isPreview} />
    </div>
  );
};

const MenuTabsRenderer = React.memo(function MenuTabsRenderer({ block }: { block: Block }) {
// ... existing MenuTabsRenderer
  const tabsData = block.menuTabs || [
    { 
      tab: 'Coffee', 
      items: [
        { name: 'Espresso', desc: 'Strong and bold', price: '$3.00' },
        { name: 'Latte', desc: 'Creamy and smooth', price: '$4.50' }
      ]
    }
  ];
  const [activeTab, setActiveTab] = useState(tabsData[0]?.tab || 'Tab 1');
  const currentItems = tabsData.find(t => t.tab === activeTab)?.items || [];

  const textColor = block.styles.color || '#000000';
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-start py-8 px-4" style={{ backgroundColor: block.styles.backgroundColor || 'transparent' }}>
      <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 max-w-full">
        {tabsData.map(t => (
          <button 
            key={t.tab}
            onClick={() => setActiveTab(t.tab)}
            className={`px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === t.tab ? 'bg-black text-white shadow-md cursor-default' : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-black border border-gray-200 cursor-pointer pointer-events-auto'}`}
          >
            {t.tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 w-full max-w-4xl">
        {currentItems.map((item, i) => (
          <div key={i} className="flex justify-between items-start border-b border-dashed border-gray-200 pb-4 animate-in fade-in duration-500">
            <div className="pr-4">
              <h4 className="font-bold text-lg leading-tight mb-1" style={{ color: textColor }}>{item.name}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <span className="font-bold text-lg whitespace-nowrap" style={{ color: textColor }}>{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

interface BlockRendererProps {
  block: Block;
  isPreview?: boolean;
}

export const BlockRenderer = React.memo(function BlockRenderer({ block, isPreview }: BlockRendererProps) {
  const { type, content, styles } = block;

  const getStyleObject = () => {
    return {
      textAlign: styles.textAlign || 'left',
      color: styles.color || 'inherit',
      backgroundColor: styles.backgroundColor || 'transparent',
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      borderRadius: styles.borderRadius,
    };
  };

  const getSpacingStyles = () => {
    if (type === 'navbar') {
      return {}; 
    }
    return {
      padding: styles.padding,
    };
  };

  const renderContent = () => {
    switch (type) {
      case 'heading':
        return (
          <h2 
            className="text-4xl font-extrabold tracking-tight leading-tight mb-2 selection:bg-blue-200"
            style={getStyleObject()}
          >
            {content}
          </h2>
        );
      case 'paragraph':
      return (
        <p 
          className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap min-h-[1.5rem] selection:bg-blue-200"
          style={getStyleObject()}
        >
          {content || ' '}
        </p>
      );
    case 'image':
      const alignment = styles.textAlign === 'center' ? 'justify-center' : styles.textAlign === 'right' ? 'justify-end' : 'justify-start';
      return (
        <div className={`flex pointer-events-auto w-full ${alignment}`} style={{ height: styles.height || '100%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'} 
            alt="Block Content" 
            className="shadow-md border border-gray-100"
            style={{ 
              borderRadius: styles.borderRadius || '0.75rem',
              width: styles.width || '100%',
              height: styles.height || '100%',
              objectFit: styles.objectFit || 'cover'
            }}
            draggable={false}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
            }}
          />
        </div>
      );
    case 'button':
      const btnAlignment = styles.textAlign === 'center' ? 'justify-center' : styles.textAlign === 'right' ? 'justify-end' : 'justify-start';
        return (
          <div className={`flex w-full h-full items-center ${btnAlignment}`}>
            <button 
              className="px-8 py-3.5 bg-black text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-gray-900 transition-all active:scale-95 active:translate-y-0 text-center"
              style={{
                backgroundColor: styles.backgroundColor && styles.backgroundColor !== 'transparent' ? styles.backgroundColor : undefined,
                color: styles.color && styles.color !== '#000000' && styles.color !== 'inherit' ? styles.color : undefined,
                fontSize: styles.fontSize,
                fontWeight: styles.fontWeight || 600,
                borderRadius: styles.borderRadius || '9999px',
              }}
              onClick={(e) => e.preventDefault()}
            >
              {content || 'Button'}
            </button>
          </div>
        );
      case 'navbar':
        const navBg = styles.backgroundColor && styles.backgroundColor !== 'transparent' ? styles.backgroundColor : '#111827';
        const navTextColor = styles.color || '#ffffff';
        const linkGap = styles.linkSpacing || '2rem';
        const navFontSize = styles.fontSize || '0.875rem';
        const cta = block.navbarCta;
        const isSticky = styles.isSticky;
        const hasTransparency = navBg === 'transparent' || navBg.startsWith('rgba') || styles.overlayOpacity;
        return (
          <nav 
            className={`w-full h-full flex items-center justify-between box-border relative overflow-hidden ${isSticky ? 'sticky top-0 z-[100] shadow-md' : ''} ${isSticky && hasTransparency ? 'backdrop-blur-md' : ''}`}
            style={{ 
              backgroundColor: navBg,
              padding: styles.padding || '0.75rem 1.5rem',
              borderRadius: styles.borderRadius || '0',
            }}
          >
            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <span 
                className="text-lg font-bold tracking-tight cursor-default select-none"
                style={{ color: navTextColor, fontSize: styles.fontSize ? `calc(${styles.fontSize} * 1.3)` : '1.125rem' }}
              >
                {content || 'YourBrand'}
              </span>
            </div>
            
            {/* Navigation Links - Centered */}
            <div 
              className="flex items-center justify-center"
              style={{ gap: linkGap }}
            >
              {block.links && block.links.map(link => (
                <a 
                  key={link.id} 
                  href={link.url || '#'} 
                  className="font-medium transition-all duration-200 cursor-pointer relative group/link"
                  style={{ color: navTextColor, fontSize: navFontSize, opacity: 0.8 }}
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                >
                  {link.label}
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover/link:w-full"
                    style={{ backgroundColor: navTextColor }}
                  />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center shrink-0">
              {cta ? (
                <a
                  href={cta.url || '#'}
                  className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                  style={{ 
                    backgroundColor: navTextColor, 
                    color: navBg,
                    fontSize: navFontSize,
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  {cta.label || 'Get Started'}
                </a>
              ) : (
                <div style={{ width: '1px' }} />
              )}
            </div>
          </nav>
        );
      case 'wa-button':
        const waAlign = styles.textAlign === 'center' ? 'justify-center' : styles.textAlign === 'right' ? 'justify-end' : 'justify-start';
        const phone = block.waData?.phone || '6281234567890';
        const message = encodeURIComponent(block.waData?.message || 'Halo');
        return (
          <div className={`flex w-full h-full items-center ${waAlign}`}>
            <a 
              href={`https://wa.me/${phone}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-green-500 text-white shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 hover:bg-green-600 transition-all active:scale-95 active:translate-y-0 text-center flex items-center justify-center pointer-events-auto"
              style={{
                backgroundColor: styles.backgroundColor && styles.backgroundColor !== 'transparent' ? styles.backgroundColor : undefined,
                color: styles.color && styles.color !== '#000000' && styles.color !== 'inherit' ? styles.color : undefined,
                fontSize: styles.fontSize,
                fontWeight: styles.fontWeight || 700,
                borderRadius: styles.borderRadius || '9999px',
              }}
              onClick={(e) => {
                // Prevent redirection when clicking in the builder
                if (e.isTrusted) e.preventDefault(); 
              }}
            >
              {content || 'Chat via WhatsApp'}
            </a>
          </div>
        );
      case 'section':
        const opacity = styles.overlayOpacity !== undefined 
            ? (styles.overlayOpacity <= 1 && styles.overlayOpacity > 0 ? styles.overlayOpacity : styles.overlayOpacity / 100) 
            : 0;
        const overlayColor = styles.overlayColor || '#000000';
        const isFullWidth = styles.isFullWidth ?? true; // Default sections to full width for landing pages
        const minHeight = `${(block.layout?.h || 15) * 30}px`;
        const bgImgUrl = styles.backgroundImage || styles.bgImage;
        const bgSize = styles.backgroundSize || 'cover';
        return (
          <div 
            className={`h-full relative flex flex-col ${isFullWidth ? 'w-[100vw] relative left-[calc(-50vw+50%)] max-w-none' : 'w-full'}`}
            style={{ 
              backgroundColor: styles.backgroundColor || 'transparent',
              backgroundImage: bgImgUrl ? `url(${bgImgUrl})` : 'none',
              backgroundSize: bgSize,
              backgroundPosition: 'center',
              backgroundRepeat: bgSize === 'contain' ? 'no-repeat' : 'repeat',
              borderRadius: styles.borderRadius || '0',
              minHeight,
            }}
          >
            {bgImgUrl && opacity > 0 && (
              <div 
                className="absolute inset-0 z-0 pointer-events-none" 
                style={{ backgroundColor: overlayColor, opacity: opacity, borderRadius: styles.borderRadius || '0' }} 
              />
            )}
            {/* The Smart Container Area (Auto-Layout) */}
            <div 
               className={`relative z-10 w-full flex-1 flex flex-wrap box-border mx-auto ${isFullWidth ? 'max-w-none px-4' : 'max-w-7xl'}`}
               style={{
                  flexDirection: styles.flexDirection || 'column',
                  alignItems: styles.alignItems || 'center',
                  justifyContent: styles.justifyContent || 'flex-start',
                  gap: styles.gap || '1rem',
                  padding: styles.padding || '2rem',
               }}
            >
              {block.children && block.children.map(child => (
                <DraggableChildWrapper 
                  key={child.id} 
                  child={child} 
                  parentId={block.id} 
                  isPreview={isPreview} 
                />
              ))}
            </div>
          </div>
        );
      case 'footer':
        return (
          <footer className="w-full py-12 px-6 flex flex-col items-center justify-center border-t border-gray-200" style={{ backgroundColor: styles.backgroundColor || '#111827', color: styles.color || '#ffffff' }}>
            <div className="max-w-7xl mx-auto flex flex-col items-center md:flex-row md:justify-between w-full gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">{content || 'Your Brand'}</h3>
                <p className="text-sm opacity-70">© {new Date().getFullYear()} All rights reserved.</p>
              </div>
              <div className="flex gap-4">
                 {block.links?.map(link => (
                    <a key={link.id} href={link.url} className="text-sm hover:underline opacity-80 hover:opacity-100">{link.label}</a>
                 ))}
              </div>
            </div>
          </footer>
        );
      case 'menu-tabs':
        return <MenuTabsRenderer block={block} />;
      default:
        return null;
    }
  };

  return (
    <div style={getSpacingStyles()} className="w-full h-full flex flex-col">
      {renderContent()}
    </div>
  );
});
