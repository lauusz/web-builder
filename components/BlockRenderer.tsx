import React from 'react';
import { Block } from '@/types/builder';

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {
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
        <div className={`flex pointer-events-auto h-full w-full ${alignment}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'} 
            alt="Block Content" 
            className="w-full h-full shadow-md border border-gray-100 object-cover"
            style={{ borderRadius: styles.borderRadius || '0.75rem' }}
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
        return (
          <nav 
            className="w-full h-full flex items-center justify-between box-border relative overflow-hidden"
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
      default:
        return null;
    }
  };

  return (
    <div style={getSpacingStyles()} className="w-full h-full flex flex-col">
      {renderContent()}
    </div>
  );
}
