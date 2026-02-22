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
   if (type !== 'section') {
      styleString += `width: ${width}; height: ${height}; `;
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
         
         let navStyle = `${styleString} width: 100%; display: flex; justify-content: space-between; align-items: center; background-color: ${navBg}; padding: ${styles.padding || '0.75rem 1.5rem'}; z-index: 100; `;
         if (isSticky) {
            navStyle += 'position: sticky; top: 0; ';
         }
         
         const linksHtml = (block.links || []).map(link => 
            `<a href="${link.url}" style="color: ${navColor}; opacity: 0.8; text-decoration: none; font-size: ${navFontSize}; font-weight: 500; transition: opacity 0.2s;">${link.label}</a>`
         ).join('');
         
         const ctaHtml = block.navbarCta 
            ? `<a href="${block.navbarCta.url || '#'}" style="padding: 8px 20px; border-radius: 8px; font-size: ${navFontSize}; font-weight: 600; text-decoration: none; background-color: ${navColor}; color: ${navBg}; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">${block.navbarCta.label || 'Get Started'}</a>`
            : '';
            
         return `
            <nav style="${navStyle}">
               <div style="font-weight: 700; font-size: calc(${navFontSize} * 1.3); color: ${navColor}; tracking-tight: -0.025em;">${content}</div>
               <div style="display: flex; gap: ${linkGap}; align-items: center;">
                  ${linksHtml}
               </div>
               <div>${ctaHtml}</div>
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

      case 'section':
         const minHeight = styles.minHeight || 'auto';
         const isFullWidth = styles.isFullWidth ?? true;
         const bgImgUrl = styles.backgroundImage || styles.bgImage;
         const bgSize = styles.backgroundSize || 'cover';
         const opacity = styles.overlayOpacity !== undefined 
            ? (styles.overlayOpacity <= 1 && styles.overlayOpacity > 0 ? styles.overlayOpacity : styles.overlayOpacity / 100) 
            : 0;
         const overlayColor = styles.overlayColor || '#000000';

         let sectionStyle = `position: relative; width: 100%; display: flex; flex-direction: column; background-color: ${bg}; min-height: ${minHeight}; border-radius: ${borderRadius}; `;
         if (bgImgUrl) {
            sectionStyle += `background-image: url('${bgImgUrl}'); background-size: ${bgSize}; background-position: center; background-repeat: ${bgSize === 'contain' ? 'no-repeat' : 'repeat'}; `;
         }

         // The children wrapper
         let containerStyle = `position: relative; z-index: 10; width: 100%; flex: 1; max-width: ${isFullWidth ? '100%' : '1280px'}; margin: 0 auto; display: flex; flex-wrap: wrap; flex-direction: ${styles.flexDirection || 'column'}; align-items: ${styles.alignItems || 'center'}; justify-content: ${styles.justifyContent || 'flex-start'}; gap: ${styles.gap || '1rem'}; padding: ${styles.padding || '2rem'}; box-sizing: border-box; `;

         const childrenHtml = (block.children || []).map(child => buildHTMLForBlock(child)).join('\n');

         const overlayHtml = (bgImgUrl && opacity > 0) 
            ? `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; background-color: ${overlayColor}; opacity: ${opacity}; border-radius: ${borderRadius}; pointer-events: none;"></div>`
            : '';

         return `
            <section style="${sectionStyle}">
               ${overlayHtml}
               <div style="${containerStyle}">
                  ${childrenHtml}
               </div>
            </section>
         `;

      default:
         return '';
   }
};

export const exportToHTML = (blocks: Block[]) => {
  const innerHtml = blocks.map(block => buildHTMLForBlock(block)).join('\n');

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
        }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        
        /* Utility Classes overrides */
        a:hover { opacity: 0.9 !important; }
        button:hover { filter: brightness(0.9); transform: translateY(-1px); }
        button:active { transform: translateY(0); }
    </style>
</head>
<body>
    <div id="root-container" style="display: flex; flex-direction: column; width: 100vw; min-height: 100vh; overflow-x: hidden;">
${innerHtml}
    </div>
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

