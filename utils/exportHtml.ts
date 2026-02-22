import { Block } from '@/types/builder';

const buildHTMLForBlock = (block: Block): string => {
   const { type, content, styles } = block;
   const align = styles.textAlign || 'left';
   const color = styles.color || 'inherit';
   const bg = styles.backgroundColor || 'transparent';
   const padding = styles.padding || '0';
   const margin = styles.margin || '0';
   const fontSize = styles.fontSize;
   const width = styles.width || 'auto';
   const height = styles.height || 'auto';
   const borderRadius = styles.borderRadius || '0';
   const isAbsolute = styles.isAbsolute;
   
   let styleString = `box-sizing: border-box; padding: ${padding}; margin: ${margin}; text-align: ${align}; color: ${color}; background-color: ${bg}; border-radius: ${borderRadius}; `;
   
   if (fontSize) styleString += `font-size: ${fontSize}; `;
   if (styles.fontWeight) styleString += `font-weight: ${styles.fontWeight}; `;
   // If it's a grid item (not section), we should force its width and height to match
   // its grid dimensions to perfectly mirror the visual canvas resize.
   // Grid units w is percentage-based relative to the row, so we use width: 100% since its container sets the width in Grid.
   // However, for pure HTML export without a CSS grid system, absolute sized heights are safest for exact mirroring.
   // Let's use the layout height rows multiplied by rowHeight (30px) as the definitive height if available.
   const mappedHeight = block.layout?.h ? `${block.layout.h * 30}px` : height;

   if (type !== 'section') {
      styleString += `width: ${width}; height: ${mappedHeight}; `;
   }

   if (isAbsolute) {
      styleString += `position: absolute; left: ${styles.posX ?? 50}%; top: ${styles.posY ?? 50}%; transform: translate(-50%, -50%); z-index: ${type === 'navbar' ? 50 : 1}; `;
   } else {
      styleString += `position: relative; `;
   }

   switch (type) {
      case 'heading':
         return `<h2 style="${styleString} margin-bottom: 0.5rem; line-height: 1.2;">${content}</h2>`;
      
      case 'paragraph':
         return `<p style="${styleString} line-height: 1.6; white-space: pre-wrap;">${content || ' '}</p>`;
      
      case 'image':
         const objectFit = styles.objectFit || 'cover';
         const alignFlex = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
         return `
            <div style="${styleString} display: flex; justify-content: ${alignFlex}; background-color: transparent; padding: 0;">
               <img src="${content}" alt="Image" style="width: ${width === 'auto' ? '100%' : width}; height: ${height === 'auto' ? '100%' : height}; object-fit: ${objectFit}; border-radius: ${borderRadius}; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);" />
            </div>
         `;
      
      case 'button':
         const btnAlign = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
         return `
            <div style="display: flex; width: 100%; justify-content: ${btnAlign};">
               <a href="#" style="${styleString} display: inline-block; padding: 14px 32px; text-decoration: none; border: none; font-weight: 600; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); background-color: ${bg !== 'transparent' ? bg : '#000000'}; color: ${color !== 'inherit' && color !== '#000000' ? color : '#ffffff'}; border-radius: ${borderRadius !== '0' ? borderRadius : '9999px'}; text-align: center;">
                  ${content || 'Button'}
               </a>
            </div>
         `;
      
      case 'navbar':
         const navBg = bg !== 'transparent' ? bg : '#111827';
         const navColor = color !== 'inherit' ? color : '#ffffff';
         const linkGap = styles.linkSpacing || '2rem';
         const navFontSize = fontSize || '0.875rem';
         const isSticky = styles.isSticky;
         
         let navClasses = `w-full flex justify-between items-center ${isSticky ? 'sticky top-0 z-50 shadow-md' : 'relative z-50'}`;
         let navStyle = `${styleString} background-color: ${navBg}; padding: ${styles.padding || '0.75rem 1.5rem'};`;
         if (isSticky && (navBg === 'transparent' || navBg.startsWith('rgba') || styles.overlayOpacity)) {
            navClasses += ' backdrop-blur-md';
         }
         
         const linksHtml = (block.links || []).map(link => 
            `<a href="${link.url}" class="opacity-80 hover:opacity-100 transition-opacity" style="color: ${navColor}; text-decoration: none; font-size: ${navFontSize}; font-weight: 500;">${link.label}</a>`
         ).join('');
         
         const ctaHtml = block.navbarCta 
            ? `<a href="${block.navbarCta.url || '#'}" style="padding: 8px 20px; border-radius: 8px; font-size: ${navFontSize}; font-weight: 600; text-decoration: none; background-color: ${navColor}; color: ${navBg}; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">${block.navbarCta.label || 'Get Started'}</a>`
            : '';
            
         return `
            <nav class="${navClasses}" style="${navStyle}">
               <div style="font-weight: 700; font-size: calc(${navFontSize} * 1.3); color: ${navColor}; letter-spacing: -0.025em; cursor: default; user-select: none;">${content}</div>
               <div class="hidden md:flex items-center" style="gap: ${linkGap};">
                  ${linksHtml}
               </div>
               <div class="shrink-0">${ctaHtml}</div>
            </nav>
         `;

      case 'wa-button':
         const waAlign = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
         const phone = block.waData?.phone || '';
         const message = encodeURIComponent(block.waData?.message || '');
         return `
            <div style="display: flex; width: 100%; justify-content: ${waAlign};">
               <a href="https://wa.me/${phone}?text=${message}" target="_blank" rel="noopener noreferrer" style="${styleString} display: inline-flex; align-items: center; justify-content: center; padding: 14px 32px; text-decoration: none; border: none; font-weight: 700; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(37, 211, 102, 0.3); background-color: ${bg !== 'transparent' ? bg : '#25D366'}; color: ${color !== 'inherit' && color !== '#000000' ? color : '#ffffff'}; border-radius: ${borderRadius !== '0' ? borderRadius : '9999px'}; text-align: center;">
                  ${content || 'Chat via WhatsApp'}
               </a>
            </div>
         `;
         
      case 'menu-tabs':
         const tabsData = block.menuTabs || [];
         if (tabsData.length === 0) return '';
         
         const uniquePrefix = `tab-group-${block.id}`;
         const tabsColor = color !== 'inherit' ? color : '#000000';
         const tabsBg = bg !== 'transparent' ? bg : 'transparent';
         
         const buttonHtml = tabsData.map((t, index) => `
            <button 
               onclick="switchTab('${uniquePrefix}', ${index})"
               id="${uniquePrefix}-btn-${index}"
               class="px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap ${index === 0 ? 'bg-black text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 cursor-pointer'}"
            >
               ${t.tab}
            </button>
         `).join('');
         
         const contentHtml = tabsData.map((t, index) => {
            const itemsHtml = t.items.map(item => `
               <div class="flex justify-between items-start border-b border-dashed border-gray-200 pb-4">
                  <div class="pr-4">
                     <h4 class="font-bold text-lg leading-tight mb-1" style="color: ${tabsColor}">${item.name}</h4>
                     <p class="text-sm text-gray-500">${item.desc}</p>
                  </div>
                  <span class="font-bold text-lg whitespace-nowrap" style="color: ${tabsColor}">${item.price}</span>
               </div>
            `).join('');
            
            return `
               <div id="${uniquePrefix}-content-${index}" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 w-full max-w-4xl transition-opacity duration-300" style="display: ${index === 0 ? 'grid' : 'none'};">
                  ${itemsHtml}
               </div>
            `;
         }).join('');
         
         return `
            <div class="w-full h-full flex flex-col items-center justify-start py-8 px-4" style="background-color: ${tabsBg}; ${styleString}">
               <div class="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 max-w-full" style="-webkit-overflow-scrolling: touch;">
                  ${buttonHtml}
               </div>
               ${contentHtml}
            </div>
         `;

      case 'section':
         // Force the minHeight to mirror the canvas exact pixel height based on grid rows (rowHeight = 30)
         let minHeight = `${(block.layout?.h || 15) * 30}px`;
         const isFullWidth = styles.isFullWidth ?? true;
         const bgImgUrl = styles.backgroundImage || styles.bgImage;
         const bgSize = styles.backgroundSize || 'cover';
         const opacity = styles.overlayOpacity !== undefined 
            ? (styles.overlayOpacity <= 1 && styles.overlayOpacity > 0 ? styles.overlayOpacity : styles.overlayOpacity / 100) 
            : 0;
         const overlayColor = styles.overlayColor || '#000000';

         let sectionClasses = `relative w-full flex flex-col ${minHeight === '100vh' ? 'min-h-screen' : ''}`;
         let sectionStyle = `background-color: ${bg}; ${minHeight !== '100vh' ? `min-height: ${minHeight};` : ''} border-radius: ${borderRadius}; `;
         
         if (bgImgUrl) {
            sectionStyle += `background-image: url('${bgImgUrl}'); background-size: ${bgSize}; background-position: center; background-repeat: ${bgSize === 'contain' ? 'no-repeat' : 'repeat'}; `;
         }

         // The children wrapper
         let containerClasses = `relative z-10 w-full flex-1 mx-auto flex flex-wrap ${isFullWidth ? 'max-w-none px-4' : 'max-w-7xl'}`;
         let containerStyle = `flex-direction: ${styles.flexDirection || 'column'}; align-items: ${styles.alignItems || 'center'}; justify-content: ${styles.justifyContent || 'flex-start'}; gap: ${styles.gap || '1rem'}; padding: ${styles.padding || '2rem'}; box-sizing: border-box; `;

         const childrenHtml = (block.children || []).map(child => buildHTMLForBlock(child)).join('\n');

         const overlayHtml = (bgImgUrl && opacity > 0) 
            ? `<div class="absolute inset-0 z-0 pointer-events-none" style="background-color: ${overlayColor}; opacity: ${opacity}; border-radius: ${borderRadius};"></div>`
            : '';

         return `
            <section class="${sectionClasses}" style="${sectionStyle}">
               ${overlayHtml}
               <div class="${containerClasses}" style="${containerStyle}">
                  ${childrenHtml}
               </div>
            </section>
         `;

      default:
         return '';
   }
};

export const exportToHTML = (blocks: Block[]) => {
  const innerHtml = blocks.map(block => {
    const contentHtml = buildHTMLForBlock(block);
    const gridColumn = block.layout ? `${block.layout.x + 1} / span ${block.layout.w}` : '1 / span 12';
    // Add +1 to height to ensure the grid cell can encompass the boundary perfectly, though mathematically it's exact rows
    const gridRow = block.layout ? `${block.layout.y + 1} / span ${block.layout.h}` : 'auto';
    return `<div class="grid-item" style="grid-column: ${gridColumn}; grid-row: ${gridRow}; z-index: ${block.type === 'navbar' ? 50 : 1}; position: relative; width: 100%; height: 100%;">${contentHtml}</div>`;
  }).join('\n');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Landing Page</title>
    <!-- Preconnect to Google Fonts for optimal typography delivery -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            },
          }
        }
      }
    </script>
    <style>
        /* Base Reset & Typography */
        *, *::before, *::after { box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { 
           margin: 0; 
           padding: 0; 
           font-family: 'Inter', system-ui, -apple-system, sans-serif; 
           background-color: #ffffff; 
           overflow-x: hidden;
           color: #111827;
           min-height: 100vh;
           display: flex;
           flex-direction: column;
        }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        
        /* Utility Classes overrides */
        a:hover { opacity: 0.9 !important; }
        button:hover { filter: brightness(0.9); transform: translateY(-1px); }
        button:active { transform: translateY(0); }

        /* Emulate React-Grid-Layout for precise canvas mirroring */
        #root-container {
           display: grid;
           grid-template-columns: repeat(12, 1fr);
           grid-auto-rows: 30px;
           width: 100vw;
           min-height: 100vh;
           overflow-x: hidden;
        }

        /* Ensure grid items fill the span completely */
        .grid-item {
           width: 100%;
           height: 100%;
        }
        
        /* Fallback for mobile devices to prevent squished columns */
        @media (max-width: 768px) {
           #root-container {
               display: flex;
               flex-direction: column;
               gap: 1rem;
           }
           .grid-item {
               grid-column: auto !important;
               grid-row: auto !important;
               height: auto !important;
               min-height: max-content;
           }
        }
    </style>
</head>
<body>
    <div id="root-container">
${innerHtml}
    </div>
    
    <!-- Interactive Element Scripts -->
    <script>
      function switchTab(prefix, targetIndex) {
         // Find all buttons starting with the prefix
         const allButtons = document.querySelectorAll('[id^="' + prefix + '-btn-"]');
         const allContents = document.querySelectorAll('[id^="' + prefix + '-content-"]');
         
         // Reset all buttons to inactive state
         allButtons.forEach(btn => {
            btn.className = "px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap bg-white text-gray-600 border border-gray-200 cursor-pointer";
         });
         
         // Hide all content areas
         allContents.forEach(content => {
            content.style.display = "none";
         });
         
         // Set target button to active state
         const targetBtn = document.getElementById(prefix + '-btn-' + targetIndex);
         if (targetBtn) {
            targetBtn.className = "px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap bg-black text-white shadow-md";
         }
         
         // Show target content area
         const targetContent = document.getElementById(prefix + '-content-' + targetIndex);
         if (targetContent) {
            targetContent.style.display = "grid";
         }
      }
    </script>
</body>
</html>`;

  // Trigger download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'landing-page.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

