export type BlockType = 'heading' | 'paragraph' | 'image' | 'button' | 'navbar';

export interface Block {
  id: string; // uuid
  type: BlockType;
  content: string; // text, image URL, or button label
  links?: { id: string; label: string; url: string }[];
  styles: {
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    padding?: string;
    margin?: string;
    [key: string]: any; // for future extensibility
  };
}
