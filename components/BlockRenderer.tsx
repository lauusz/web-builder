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
    };
  };

  const getSpacingStyles = () => {
    return {
      padding: styles.padding,
      margin: styles.margin,
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
        <div className={`flex py-2 pointer-events-auto ${alignment}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'} 
            alt="Block Content" 
            className="max-w-full h-auto rounded-xl shadow-md border border-gray-100 object-cover"
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
          <div className={`flex py-2 ${btnAlignment}`}>
            <button 
              className="px-8 py-3.5 bg-black text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-gray-900 transition-all active:scale-95 active:translate-y-0"
              style={{
                backgroundColor: styles.backgroundColor && styles.backgroundColor !== 'transparent' ? styles.backgroundColor : undefined,
                color: styles.color && styles.color !== '#000000' && styles.color !== 'inherit' ? styles.color : undefined,
              }}
              onClick={(e) => e.preventDefault()}
            >
              {content || 'Button'}
            </button>
          </div>
        );
      case 'navbar':
        return (
          <nav 
            className="flex items-center justify-between w-full rounded-md"
            style={getStyleObject()}
          >
            <div className="font-bold text-xl tracking-tight">
              {content || 'Brand Name'}
            </div>
            {block.links && block.links.length > 0 && (
              <div className="flex items-center gap-6">
                {block.links.map(link => (
                  <a 
                    key={link.id} 
                    href={link.url || '#'} 
                    className="text-sm font-medium opacity-90 hover:opacity-100 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </nav>
        );
      default:
        return null;
    }
  };

  return (
    <div style={getSpacingStyles()} className="w-full">
      {renderContent()}
    </div>
  );
}
