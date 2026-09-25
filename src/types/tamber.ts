// ---------------------------------------------------------------------------
// Core structure: a Presentation contains Slides, each Slide contains Elements
// ---------------------------------------------------------------------------

export interface TamberPresentation {
  id: string;
  title: string;
  slides: TamberSlide[];
  createdAt: string;
  updatedAt: string;
}

export interface TamberSlide {
  id: string;
  elements: TamberElement[];
}

// ---------------------------------------------------------------------------
// Every element, whatever its type, shares these base properties.
// Position/size are percentages (0-100) of the slide's width/height, so
// slides scale cleanly across different screen sizes.
// ---------------------------------------------------------------------------

export interface ElementBase {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layer: number;
  border?: ElementBorder;
}

export interface ElementBorder {
  width: number;
  color: string;
  radius: number;
}

// ---------------------------------------------------------------------------
// Type-specific elements
// ---------------------------------------------------------------------------

export interface TextElement extends ElementBase {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  textAlign: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

export interface ImageElement extends ElementBase {
  type: 'image';
  src: string;
  fitMode: 'stretch' | 'crop';
  distortion?: 'none' | 'wavy';
}

export interface VideoElement extends ElementBase {
  type: 'video';
  src: string;
}

export interface AudioElement extends ElementBase {
  type: 'audio';
  src: string;
  trimStart: number;
  trimEnd: number;
}

export interface ShapeElement extends ElementBase {
  type: 'shape';
  shape: 'rectangle' | 'arrow';
  fillColor: string;
}

export interface LinkElement extends ElementBase {
  type: 'link';
  url: string;
}

export interface ButtonElement extends ElementBase {
  type: 'button';
  text: string;
  transparent: boolean;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  textAlign: 'left' | 'center' | 'right';
  backgroundColor?: string;
  backgroundImage?: string;
  action?: ButtonAction;
}

export type TamberElement =
  | TextElement
  | ImageElement
  | VideoElement
  | AudioElement
  | ShapeElement
  | LinkElement
  | ButtonElement;

// ---------------------------------------------------------------------------
// Button actions. A button's click does exactly one of these three things.
// "animate" and "change" both need a target: either the button's own id
// (self) or another element's id on the same slide — this is how chain
// reactions form naturally, since that target might itself be a button
// with its own action.
// ---------------------------------------------------------------------------

export type ButtonAction =
  | { kind: 'navigate'; toSlideId: string }
  | { kind: 'animate'; targetId: string; animation: 'fade' | 'appear' | 'disappear' }
  | { kind: 'change'; targetId: string; changes: ElementChange };

// What a "change" action actually overwrites. Only the properties present
// get changed — e.g. a text-only change just sets `text`, leaving
// everything else on the target element untouched.
export interface ElementChange {
  text?: string;
  fontColor?: string;
  border?: ElementBorder;
  backgroundColor?: string;
  backgroundImage?: string;
}
