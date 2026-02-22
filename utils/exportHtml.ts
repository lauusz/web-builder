import { Block } from '@/types/builder';

export const exportToHTML = (blocks: Block[]) => {
  let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Landing Page</title>
    <style>
        body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #f3f4f6; }
        .grid-container { position: relative; width: 100%; max-width: 1200px; margin: 0 auto; min-height: 100vh; background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .block-wrapper { position: absolute; box-sizing: border-box; overflow: hidden; }
        .block-content { width: 100%; height: 100%; display: flex; align-items: center; box-sizing: border-box; flex-direction: column; justify-content: center; }
        .block-content img { object-fit: cover; }
    </style>
</head>
<body>
    <div class="grid-container">\n`;

  const colWidth = 100 / 12; // Grid has 12 cols
  const rowHeight = 30;

  blocks.forEach(block => {
      const { x, y, w, h } = block.layout;
      const top = y * rowHeight;
      const left = x * colWidth;
      const width = w * colWidth;
      const height = h * rowHeight;
      
      const align = block.styles.textAlign || 'left';
      const color = block.styles.color || 'inherit';
      const bg = block.styles.backgroundColor || 'transparent';
      const padding = block.styles.padding || '0.5rem';
      const margin = block.styles.margin || '0';
      
      let innerHTML = '';
      const rawContent = block.content || '';
      
      if (block.type === 'heading') {
          innerHTML = `<h2>${rawContent}</h2>`;
      } else if (block.type === 'paragraph') {
          innerHTML = `<p>${rawContent}</p>`;
      } else if (block.type === 'image') {
          innerHTML = `<img src="${rawContent}" alt="Image" style="width: 100%; height: 100%; border-radius: 0.75rem;" />`;
      } else if (block.type === 'button') {
          innerHTML = `<button style="padding: 14px 24px; border-radius: 9999px; font-weight: bold; border: none; cursor: pointer; color: ${color}; background-color: ${bg !== 'transparent' ? bg : '#000'}">${rawContent}</button>`;
      } else if (block.type === 'navbar') {
          const navBg = bg !== 'transparent' ? bg : '#111827';
          const navColor = color !== 'inherit' ? color : '#ffffff';
          const linkGap = block.styles.linkSpacing || '2rem';
          const fontSize = block.styles.fontSize || '0.875rem';
          const ctaHtml = block.navbarCta 
              ? `<a href="${block.navbarCta.url || '#'}" style="padding: 8px 20px; border-radius: 8px; font-size: ${fontSize}; font-weight: 600; text-decoration: none; background-color: ${navColor}; color: ${navBg};">${block.navbarCta.label || 'Get Started'}</a>`
              : '';
          innerHTML = `<nav style="display: flex; justify-content: space-between; align-items: center; width: 100%; height: 100%; padding: ${padding}; background-color: ${navBg}; box-sizing: border-box;">
              <div style="font-weight: bold; font-size: 1.125rem; color: ${navColor};">${rawContent}</div>
              <div style="display: flex; gap: ${linkGap}; align-items: center;">
                  ${(block.links || []).map(link => `<a href="${link.url}" style="color: ${navColor}; opacity: 0.8; text-decoration: none; font-size: ${fontSize}; font-weight: 500;">${link.label}</a>`).join('')}
              </div>
              <div>${ctaHtml}</div>
          </nav>`;
      } else if (block.type === 'wa-button') {
          const phone = block.waData?.phone || '';
          const message = encodeURIComponent(block.waData?.message || '');
          innerHTML = `<a href="https://wa.me/${phone}?text=${message}" target="_blank" style="display: inline-block; padding: 14px 24px; border-radius: 9999px; font-weight: bold; text-decoration: none; color: ${color}; background-color: ${bg !== 'transparent' ? bg : '#25D366'}">${rawContent}</a>`;
      }

      const alignStyle = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
      htmlContent += `        <div class="block-wrapper" style="top: ${top}px; left: ${left}%; width: ${width}%; height: ${height}px; padding: ${padding}; margin: ${margin}; text-align: ${align}; color: ${color}; background-color: ${bg}; border-radius: ${bg !== 'transparent' ? '0.75rem' : '0'};">
          <div class="block-content" style="align-items: ${alignStyle}; text-align: ${align};">
              ${innerHTML}
          </div>
      </div>\n`;
  });

  htmlContent += `    </div>\n</body>\n</html>`;

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
