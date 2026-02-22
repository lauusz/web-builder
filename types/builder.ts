export type BlockType = 'heading' | 'paragraph' | 'image' | 'button' | 'navbar' | 'wa-button' | 'section' | 'menu-tabs' | 'footer';

export interface Block {
  id: string; // uuid
  type: BlockType;
  content: string; // text, image URL, or button label
  links?: { id: string; label: string; url: string }[];
  navbarCta?: { label: string; url: string };
  waData?: { phone: string; message: string };
  children?: Block[];
  menuTabs?: { tab: string; items: { name: string; desc: string; price: string; }[] }[];
  childrenIds?: string[];
  layout: { x: number; y: number; w: number; h: number };
  styles: {
    color?: string;
    backgroundColor?: string;
    bgImage?: string;
    backgroundImage?: string;
    backgroundSize?: 'cover' | 'contain' | string;
    overlayColor?: string;
    overlayOpacity?: number;
    posX?: number; // Figma-style percentage X
    posY?: number; // Figma-style percentage Y
    flexDirection?: 'row' | 'column'; // Auto-layout direction
    alignItems?: string; // Auto-layout cross-axis alignment
    justifyContent?: string; // Auto-layout main-axis alignment
    gap?: string; // Auto-layout spacing
    isSticky?: boolean;
    isAbsolute?: boolean; // Toggles flexbox vs absolute positioning for children
    isFullWidth?: boolean;
    minHeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    padding?: string;
    margin?: string;
    width?: string;
    height?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    fontSize?: string;
    fontWeight?: string;
    borderRadius?: string;
    linkSpacing?: string;
    [key: string]: any; // for future extensibility
  };
}
