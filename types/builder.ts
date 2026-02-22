export type BlockType = 'heading' | 'paragraph' | 'image' | 'button' | 'navbar' | 'wa-button';

export interface Block {
  id: string; // uuid
  type: BlockType;
  content: string; // text, image URL, or button label
  links?: { id: string; label: string; url: string }[];
  navbarCta?: { label: string; url: string };
  waData?: { phone: string; message: string };
  layout: { x: number; y: number; w: number; h: number };
  styles: {
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    borderRadius?: string;
    linkSpacing?: string;
    [key: string]: any; // for future extensibility
  };
}
