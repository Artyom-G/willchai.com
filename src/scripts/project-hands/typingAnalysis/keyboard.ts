import type { KeyboardKeyInfo, KeyboardLayout, KeyFinger, KeyHand, KeyRow } from "./types";

type PhysicalKey = {
  code: string;
  row: KeyRow;
  col: number;
  x: number;
  y: number;
  width: number;
  hand: KeyHand;
  finger: KeyFinger;
  // Physical code of the home-row key this finger anchors to, so the "home
  // key" a finger returns to can be resolved per-layout instead of hardcoded
  // to a literal QWERTY letter.
  homeCode?: string;
};

function physicalKey(
  code: string,
  row: KeyRow,
  col: number,
  x: number,
  y: number,
  hand: KeyHand,
  finger: KeyFinger,
  offset = 0,
  homeCode?: string,
): PhysicalKey {
  return { code, row, col, x: x + offset, y, width: 1, hand, finger, homeCode };
}

// Physical geometry never changes between layouts - the same physical
// keyboard shape underlies QWERTY, Dvorak, and Colemak. Only which character
// each physical key produces (below, in LAYOUT_KEYMAPS) changes per layout.
const physicalRows: PhysicalKey[][] = [
  [
    physicalKey("Backquote", "number", 0, 0, 0, "left", "pinky"),
    physicalKey("Digit1", "number", 1, 1, 0, "left", "pinky"),
    physicalKey("Digit2", "number", 2, 2, 0, "left", "ring"),
    physicalKey("Digit3", "number", 3, 3, 0, "left", "middle"),
    physicalKey("Digit4", "number", 4, 4, 0, "left", "index"),
    physicalKey("Digit5", "number", 5, 5, 0, "left", "index"),
    physicalKey("Digit6", "number", 6, 6, 0, "right", "index"),
    physicalKey("Digit7", "number", 7, 7, 0, "right", "index"),
    physicalKey("Digit8", "number", 8, 8, 0, "right", "middle"),
    physicalKey("Digit9", "number", 9, 9, 0, "right", "ring"),
    physicalKey("Digit0", "number", 10, 10, 0, "right", "pinky"),
    physicalKey("Minus", "number", 11, 11, 0, "right", "pinky"),
    physicalKey("Equal", "number", 12, 12, 0, "right", "pinky"),
  ],
  [
    physicalKey("KeyQ", "top", 0, 0, 1, "left", "pinky", 0.18, "KeyA"),
    physicalKey("KeyW", "top", 1, 1, 1, "left", "ring", 0.18, "KeyS"),
    physicalKey("KeyE", "top", 2, 2, 1, "left", "middle", 0.18, "KeyD"),
    physicalKey("KeyR", "top", 3, 3, 1, "left", "index", 0.18, "KeyF"),
    physicalKey("KeyT", "top", 4, 4, 1, "left", "index", 0.18, "KeyF"),
    physicalKey("KeyY", "top", 5, 5, 1, "right", "index", 0.18, "KeyJ"),
    physicalKey("KeyU", "top", 6, 6, 1, "right", "index", 0.18, "KeyJ"),
    physicalKey("KeyI", "top", 7, 7, 1, "right", "middle", 0.18, "KeyK"),
    physicalKey("KeyO", "top", 8, 8, 1, "right", "ring", 0.18, "KeyL"),
    physicalKey("KeyP", "top", 9, 9, 1, "right", "pinky", 0.18, "Semicolon"),
    physicalKey("BracketLeft", "top", 10, 10, 1, "right", "pinky", 0.18, "Semicolon"),
    physicalKey("BracketRight", "top", 11, 11, 1, "right", "pinky", 0.18, "Semicolon"),
    physicalKey("Backslash", "top", 12, 12, 1, "right", "pinky", 0.18, "Semicolon"),
  ],
  [
    physicalKey("KeyA", "home", 0, 0, 2, "left", "pinky", 0.35, "KeyA"),
    physicalKey("KeyS", "home", 1, 1, 2, "left", "ring", 0.35, "KeyS"),
    physicalKey("KeyD", "home", 2, 2, 2, "left", "middle", 0.35, "KeyD"),
    physicalKey("KeyF", "home", 3, 3, 2, "left", "index", 0.35, "KeyF"),
    physicalKey("KeyG", "home", 4, 4, 2, "left", "index", 0.35, "KeyF"),
    physicalKey("KeyH", "home", 5, 5, 2, "right", "index", 0.35, "KeyJ"),
    physicalKey("KeyJ", "home", 6, 6, 2, "right", "index", 0.35, "KeyJ"),
    physicalKey("KeyK", "home", 7, 7, 2, "right", "middle", 0.35, "KeyK"),
    physicalKey("KeyL", "home", 8, 8, 2, "right", "ring", 0.35, "KeyL"),
    physicalKey("Semicolon", "home", 9, 9, 2, "right", "pinky", 0.35, "Semicolon"),
    physicalKey("Quote", "home", 10, 10, 2, "right", "pinky", 0.35, "Semicolon"),
  ],
  [
    physicalKey("KeyZ", "bottom", 0, 0, 3, "left", "pinky", 0.85, "KeyA"),
    physicalKey("KeyX", "bottom", 1, 1, 3, "left", "ring", 0.85, "KeyS"),
    physicalKey("KeyC", "bottom", 2, 2, 3, "left", "middle", 0.85, "KeyD"),
    physicalKey("KeyV", "bottom", 3, 3, 3, "left", "index", 0.85, "KeyF"),
    physicalKey("KeyB", "bottom", 4, 4, 3, "left", "index", 0.85, "KeyF"),
    physicalKey("KeyN", "bottom", 5, 5, 3, "right", "index", 0.85, "KeyJ"),
    physicalKey("KeyM", "bottom", 6, 6, 3, "right", "index", 0.85, "KeyJ"),
    physicalKey("Comma", "bottom", 7, 7, 3, "right", "middle", 0.85, "KeyK"),
    physicalKey("Period", "bottom", 8, 8, 3, "right", "ring", 0.85, "KeyL"),
    physicalKey("Slash", "bottom", 9, 9, 3, "right", "pinky", 0.85, "Semicolon"),
  ],
  [
    physicalKey("Space", "thumb", 0, 3.2, 4, "thumb", "thumb"),
  ],
];

// Which typed character each physical key (by `code`) produces, per layout.
// Only the alpha/punctuation zone remapped by Dvorak/Colemak needs an entry -
// the number row, space, and modifier keys are identical across all three
// layouts. These mappings are the standard US Dvorak Simplified Keyboard and
// Colemak layouts - verify against a canonical reference before changing, a
// subtle error here silently corrupts classification for that layout.
const LAYOUT_KEYMAPS: Record<KeyboardLayout, Record<string, { base: string; shifted: string }>> = {
  qwerty: {
    KeyQ: { base: "q", shifted: "Q" }, KeyW: { base: "w", shifted: "W" }, KeyE: { base: "e", shifted: "E" },
    KeyR: { base: "r", shifted: "R" }, KeyT: { base: "t", shifted: "T" }, KeyY: { base: "y", shifted: "Y" },
    KeyU: { base: "u", shifted: "U" }, KeyI: { base: "i", shifted: "I" }, KeyO: { base: "o", shifted: "O" },
    KeyP: { base: "p", shifted: "P" }, BracketLeft: { base: "[", shifted: "{" }, BracketRight: { base: "]", shifted: "}" },
    Backslash: { base: "\\", shifted: "|" },
    KeyA: { base: "a", shifted: "A" }, KeyS: { base: "s", shifted: "S" }, KeyD: { base: "d", shifted: "D" },
    KeyF: { base: "f", shifted: "F" }, KeyG: { base: "g", shifted: "G" }, KeyH: { base: "h", shifted: "H" },
    KeyJ: { base: "j", shifted: "J" }, KeyK: { base: "k", shifted: "K" }, KeyL: { base: "l", shifted: "L" },
    Semicolon: { base: ";", shifted: ":" }, Quote: { base: "'", shifted: "\"" },
    KeyZ: { base: "z", shifted: "Z" }, KeyX: { base: "x", shifted: "X" }, KeyC: { base: "c", shifted: "C" },
    KeyV: { base: "v", shifted: "V" }, KeyB: { base: "b", shifted: "B" }, KeyN: { base: "n", shifted: "N" },
    KeyM: { base: "m", shifted: "M" }, Comma: { base: ",", shifted: "<" }, Period: { base: ".", shifted: ">" },
    Slash: { base: "/", shifted: "?" },
  },
  dvorak: {
    KeyQ: { base: "'", shifted: "\"" }, KeyW: { base: ",", shifted: "<" }, KeyE: { base: ".", shifted: ">" },
    KeyR: { base: "p", shifted: "P" }, KeyT: { base: "y", shifted: "Y" }, KeyY: { base: "f", shifted: "F" },
    KeyU: { base: "g", shifted: "G" }, KeyI: { base: "c", shifted: "C" }, KeyO: { base: "r", shifted: "R" },
    KeyP: { base: "l", shifted: "L" }, BracketLeft: { base: "/", shifted: "?" }, BracketRight: { base: "=", shifted: "+" },
    Backslash: { base: "\\", shifted: "|" },
    KeyA: { base: "a", shifted: "A" }, KeyS: { base: "o", shifted: "O" }, KeyD: { base: "e", shifted: "E" },
    KeyF: { base: "u", shifted: "U" }, KeyG: { base: "i", shifted: "I" }, KeyH: { base: "d", shifted: "D" },
    KeyJ: { base: "h", shifted: "H" }, KeyK: { base: "t", shifted: "T" }, KeyL: { base: "n", shifted: "N" },
    Semicolon: { base: "s", shifted: "S" }, Quote: { base: "-", shifted: "_" },
    KeyZ: { base: ";", shifted: ":" }, KeyX: { base: "q", shifted: "Q" }, KeyC: { base: "j", shifted: "J" },
    KeyV: { base: "k", shifted: "K" }, KeyB: { base: "x", shifted: "X" }, KeyN: { base: "b", shifted: "B" },
    KeyM: { base: "m", shifted: "M" }, Comma: { base: "w", shifted: "W" }, Period: { base: "v", shifted: "V" },
    Slash: { base: "z", shifted: "Z" },
  },
  colemak: {
    KeyQ: { base: "q", shifted: "Q" }, KeyW: { base: "w", shifted: "W" }, KeyE: { base: "f", shifted: "F" },
    KeyR: { base: "p", shifted: "P" }, KeyT: { base: "g", shifted: "G" }, KeyY: { base: "j", shifted: "J" },
    KeyU: { base: "l", shifted: "L" }, KeyI: { base: "u", shifted: "U" }, KeyO: { base: "y", shifted: "Y" },
    KeyP: { base: ";", shifted: ":" }, BracketLeft: { base: "[", shifted: "{" }, BracketRight: { base: "]", shifted: "}" },
    Backslash: { base: "\\", shifted: "|" },
    KeyA: { base: "a", shifted: "A" }, KeyS: { base: "r", shifted: "R" }, KeyD: { base: "s", shifted: "S" },
    KeyF: { base: "t", shifted: "T" }, KeyG: { base: "d", shifted: "D" }, KeyH: { base: "h", shifted: "H" },
    KeyJ: { base: "n", shifted: "N" }, KeyK: { base: "e", shifted: "E" }, KeyL: { base: "i", shifted: "I" },
    Semicolon: { base: "o", shifted: "O" }, Quote: { base: "'", shifted: "\"" },
    KeyZ: { base: "z", shifted: "Z" }, KeyX: { base: "x", shifted: "X" }, KeyC: { base: "c", shifted: "C" },
    KeyV: { base: "v", shifted: "V" }, KeyB: { base: "b", shifted: "B" }, KeyN: { base: "k", shifted: "K" },
    KeyM: { base: "m", shifted: "M" }, Comma: { base: ",", shifted: "<" }, Period: { base: ".", shifted: ">" },
    Slash: { base: "/", shifted: "?" },
  },
};

// The number row (and the physical Minus/Equal keys specifically) is treated
// as identical across QWERTY/Dvorak/Colemak here - true hardware Dvorak also
// remaps Minus/Equal to "[" "]", but those are rarely-drilled symbols for a
// typing trainer, so this is a deliberate simplification, not an oversight.
const NUMBER_ROW_CHARS: Record<string, { base: string; shifted: string }> = {
  Backquote: { base: "`", shifted: "~" },
  Digit1: { base: "1", shifted: "!" },
  Digit2: { base: "2", shifted: "@" },
  Digit3: { base: "3", shifted: "#" },
  Digit4: { base: "4", shifted: "$" },
  Digit5: { base: "5", shifted: "%" },
  Digit6: { base: "6", shifted: "^" },
  Digit7: { base: "7", shifted: "&" },
  Digit8: { base: "8", shifted: "*" },
  Digit9: { base: "9", shifted: "(" },
  Digit0: { base: "0", shifted: ")" },
  Minus: { base: "-", shifted: "_" },
  Equal: { base: "=", shifted: "+" },
};

function charsFor(layout: KeyboardLayout, code: string): { base: string; shifted: string } | undefined {
  return LAYOUT_KEYMAPS[layout][code] ?? NUMBER_ROW_CHARS[code];
}

function buildKeyboardRows(layout: KeyboardLayout): (Omit<KeyboardKeyInfo, "requiresShift"> & { homeKey?: string })[][] {
  return physicalRows.map((row) =>
    row.map((phys) => {
      if (phys.code === "Space") {
        return {
          key: "space", display: "Space", code: "Space", row: phys.row, rowIndex: phys.y,
          col: phys.col, x: phys.x, y: phys.y, width: 5.4, hand: "thumb", finger: "thumb", homeKey: "space",
        };
      }
      const chars = charsFor(layout, phys.code);
      const base = chars?.base ?? phys.code;
      const shifted = chars?.shifted;
      const homeChars = phys.homeCode ? charsFor(layout, phys.homeCode) : undefined;
      return {
        key: base,
        display: base,
        shifted,
        code: phys.code,
        row: phys.row,
        rowIndex: phys.y,
        col: phys.col,
        x: phys.x,
        y: phys.y,
        width: 1,
        hand: phys.hand,
        finger: phys.finger,
        homeKey: homeChars?.base,
      };
    }),
  );
}

function buildKeyLookup(layout: KeyboardLayout): Map<string, KeyboardKeyInfo> {
  const lookup = new Map<string, KeyboardKeyInfo>();
  buildKeyboardRows(layout)
    .flat()
    .forEach((item) => {
      const base = { ...item, requiresShift: false };
      lookup.set(item.key, base);
      if (item.shifted) lookup.set(item.shifted, { ...base, requiresShift: true });
    });
  return lookup;
}

const ALL_LAYOUTS: KeyboardLayout[] = ["qwerty", "dvorak", "colemak"];
const keyLookupByLayout: Record<KeyboardLayout, Map<string, KeyboardKeyInfo>> = Object.fromEntries(
  ALL_LAYOUTS.map((layout) => [layout, buildKeyLookup(layout)]),
) as Record<KeyboardLayout, Map<string, KeyboardKeyInfo>>;

export function getKeyboardRows(platform?: "mac" | "win", layout: KeyboardLayout = "qwerty") {
  const isMac = platform !== "win";
  return buildKeyboardRows(layout).map((row, ri) => {
    const items = row.map((item) => ({ ...item, requiresShift: false }));
    if (ri === 0) {
      items.push({
        key: "Backspace", display: "⌫", code: "Backspace",
        row: "number", rowIndex: 0, col: 13, x: 13, y: 0, width: 2,
        hand: "right", finger: "pinky", requiresShift: false,
      });
    } else if (ri === 1) {
      items.unshift({
        key: "Tab", display: "Tab", code: "Tab",
        row: "top", rowIndex: 1, col: -1, x: -1.32, y: 1, width: 1.5,
        hand: "left", finger: "pinky", requiresShift: false,
      });
    } else if (ri === 2) {
      items.unshift({
        key: "CapsLock", display: "Caps", code: "CapsLock",
        row: "home", rowIndex: 2, col: -1, x: -1.4, y: 2, width: 1.75,
        hand: "left", finger: "pinky", requiresShift: false,
      });
      items.push({
        key: "Enter", display: "↵", code: "Enter",
        row: "home", rowIndex: 2, col: 11, x: 11.35, y: 2, width: 2.25,
        hand: "right", finger: "pinky", requiresShift: false,
      });
    } else if (ri === 3) {
      items.unshift({
        key: "ShiftLeft", display: "Shift", code: "ShiftLeft",
        row: "bottom", rowIndex: 3, col: -1, x: -1.4, y: 3, width: 2.25,
        hand: "left", finger: "pinky", requiresShift: false,
      });
      items.push({
        key: "ShiftRight", display: "Shift", code: "ShiftRight",
        row: "bottom", rowIndex: 3, col: 10, x: 10.85, y: 3, width: 2.75,
        hand: "right", finger: "pinky", requiresShift: false,
      });
    } else if (ri === 4) {
      if (isMac) {
        items.unshift(
          { key: "ControlLeft", display: "⌃", code: "ControlLeft", row: "thumb", rowIndex: 4, col: -3, x: -0.55, y: 4, width: 1.25, hand: "left", finger: "thumb", requiresShift: false },
          { key: "AltLeft", display: "⌥", code: "AltLeft", row: "thumb", rowIndex: 4, col: -2, x: 0.7, y: 4, width: 1.25, hand: "left", finger: "thumb", requiresShift: false },
          { key: "MetaLeft", display: "⌘", code: "MetaLeft", row: "thumb", rowIndex: 4, col: -1, x: 1.95, y: 4, width: 1.25, hand: "left", finger: "thumb", requiresShift: false },
        );
        items.push(
          { key: "MetaRight", display: "⌘", code: "MetaRight", row: "thumb", rowIndex: 4, col: 4, x: 8.6, y: 4, width: 1.25, hand: "right", finger: "thumb", requiresShift: false },
          { key: "AltRight", display: "⌥", code: "AltRight", row: "thumb", rowIndex: 4, col: 5, x: 9.85, y: 4, width: 1.25, hand: "right", finger: "thumb", requiresShift: false },
          { key: "ControlRight", display: "⌃", code: "ControlRight", row: "thumb", rowIndex: 4, col: 6, x: 11.1, y: 4, width: 1.25, hand: "right", finger: "thumb", requiresShift: false },
        );
      } else {
        // Windows layout: Ctrl ⊞ Alt / Alt ⊞ Ctrl
        items.unshift(
          { key: "ControlLeft", display: "Ctrl", code: "ControlLeft", row: "thumb", rowIndex: 4, col: -3, x: -0.55, y: 4, width: 1.25, hand: "left", finger: "thumb", requiresShift: false },
          { key: "MetaLeft", display: "⊞", code: "MetaLeft", row: "thumb", rowIndex: 4, col: -1, x: 1.95, y: 4, width: 1.25, hand: "left", finger: "thumb", requiresShift: false },
          { key: "AltLeft", display: "Alt", code: "AltLeft", row: "thumb", rowIndex: 4, col: -2, x: 0.7, y: 4, width: 1.25, hand: "left", finger: "thumb", requiresShift: false },
        );
        items.push(
          { key: "AltRight", display: "Alt", code: "AltRight", row: "thumb", rowIndex: 4, col: 5, x: 9.85, y: 4, width: 1.25, hand: "right", finger: "thumb", requiresShift: false },
          { key: "MetaRight", display: "⊞", code: "MetaRight", row: "thumb", rowIndex: 4, col: 4, x: 8.6, y: 4, width: 1.25, hand: "right", finger: "thumb", requiresShift: false },
          { key: "ControlRight", display: "Ctrl", code: "ControlRight", row: "thumb", rowIndex: 4, col: 6, x: 11.1, y: 4, width: 1.25, hand: "right", finger: "thumb", requiresShift: false },
        );
      }
    }
    return items;
  });
}

export function displayChar(char: string) {
  if (char === " ") return "space";
  if (char === "\n") return "newline";
  if (char === "\t") return "tab";
  return char || "unknown";
}

function normalizeLookupKey(char: string) {
  if (/\s/.test(char)) return "space";
  if (char.length === 1 && char >= "A" && char <= "Z") return char;
  return char.toLowerCase();
}

export function keyInfoFor(char: string, layout: KeyboardLayout = "qwerty"): KeyboardKeyInfo {
  const lookup = normalizeLookupKey(char);
  const known = keyLookupByLayout[layout].get(lookup);
  if (known) return { ...known, display: known.display === "space" ? "Space" : known.display };
  return {
    key: char || "unknown",
    display: displayChar(char),
    code: "Unknown",
    row: "unknown",
    rowIndex: -1,
    col: -1,
    x: -1,
    y: -1,
    width: 1,
    hand: "unknown",
    finger: "unknown",
    requiresShift: false,
  };
}

