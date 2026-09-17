// Keyboard types retained from Tachyboard for the Projects hand scene.
export type KeyHand = "left" | "right" | "thumb" | "unknown";
export type KeyFinger = "pinky" | "ring" | "middle" | "index" | "thumb" | "unknown";
export type KeyRow = "number" | "top" | "home" | "bottom" | "thumb" | "unknown";
export type KeyboardLayout = "qwerty" | "dvorak" | "colemak";

export type KeyboardKeyInfo = {
  key: string;
  display: string;
  code: string;
  shifted?: string;
  row: KeyRow;
  rowIndex: number;
  col: number;
  x: number;
  y: number;
  width: number;
  hand: KeyHand;
  finger: KeyFinger;
  homeKey?: string;
  requiresShift: boolean;
};

