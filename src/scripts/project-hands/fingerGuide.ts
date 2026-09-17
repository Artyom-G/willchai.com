import { getKeyboardRows, keyInfoFor } from "./typingAnalysis/keyboard";
import type { KeyFinger, KeyboardLayout } from "./typingAnalysis/types";

export type GuideHand = "left" | "right";
export type GuideFinger = Exclude<KeyFinger, "unknown">;
export type FingerGuideTarget = {
  cue: string;
  keyCode?: string;
  hand?: GuideHand;
  finger?: GuideFinger;
  shiftHand?: GuideHand;
};

const fingerNames: Record<GuideFinger, string> = {
  index: "index finger", middle: "middle finger", ring: "ring finger", pinky: "little finger", thumb: "thumb",
};

export function fingerGuideTarget(character: string | undefined, layout: KeyboardLayout = "qwerty"): FingerGuideTarget {
  if (!character) return { cue: "Rest your fingers on the home row" };
  if (character === " ") return { cue: "Space · Right thumb", keyCode: "Space", hand: "right", finger: "thumb" };
  if (character === "\n") return { cue: "Enter · Right little finger", keyCode: "Enter", hand: "right", finger: "pinky" };
  const key = keyInfoFor(character, layout);
  if (key.finger === "unknown" || (key.hand !== "left" && key.hand !== "right")) {
    return { cue: character === "\t" ? "Next character · Tab" : `Next character · ${character}` };
  }
  const shiftHand = key.requiresShift ? (key.hand === "left" ? "right" : "left") : undefined;
  const handLabel = key.hand === "left" ? "Left" : "Right";
  const label = /^[a-z]$/i.test(character) ? character.toUpperCase() : character;
  return {
    cue: `${label} · ${handLabel} ${fingerNames[key.finger]}${shiftHand ? ` · ${shiftHand === "left" ? "Left" : "Right"} Shift` : ""}`,
    keyCode: key.code,
    hand: key.hand,
    finger: key.finger,
    shiftHand,
  };
}

// The same row widths drive the existing keyboard renderer. The guide adds
// drawing coordinates once, independently of the typing cursor.
function positionKeyboard(platform: "mac" | "win", layout: KeyboardLayout = "qwerty") { return getKeyboardRows(platform, layout).flatMap((row, rowIndex) => {
  let units = 0;
  return row.map((key) => {
    const positioned = { ...key, left: 4 + units * 48, top: 4 + rowIndex * 44, drawWidth: key.width * 48 - 4 };
    units += key.width;
    return positioned;
  });
}); }
const keyboards = { mac: positionKeyboard("mac"), win: positionKeyboard("win") };
export function getGuideKeyboard(platform: "mac" | "win", layout: KeyboardLayout = "qwerty") { return layout === "qwerty" ? keyboards[platform] : positionKeyboard(platform, layout); }
export const guideKeyboard = keyboards.mac;
export const guideKeyByCode = new Map(guideKeyboard.map((key) => [key.code, key]));
