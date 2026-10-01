/**
 * Color-name -> hex map shared by the builder, AI normalizer and mock AI.
 * Keys are lowercase; multi-word names use single spaces.
 */
export const COLOR_NAME_TO_HEX: Readonly<Record<string, string>> = {
  pink: "#F7C8D0",
  "light pink": "#FBE0E5",
  "hot pink": "#E75480",
  "rose gold": "#B76E79",
  red: "#C0392B",
  burgundy: "#7B1E3A",
  orange: "#F2994A",
  peach: "#FFD1B3",
  yellow: "#F6E05E",
  white: "#FFFFFF",
  ivory: "#FFF8E7",
  cream: "#FFF3D6",
  gold: "#D4AF37",
  silver: "#C0C0C0",
  green: "#6BBF59",
  "dark green": "#1F4D2E",
  "forest green": "#228B22",
  sage: "#A3B899",
  mint: "#BFE8D4",
  blue: "#5B9BD5",
  "light blue": "#BBDDF5",
  navy: "#1F2A44",
  teal: "#3AA6A0",
  purple: "#8E5BB5",
  lavender: "#CDB8E6",
  lilac: "#D7C4EC",
  violet: "#7F4FC9",
  brown: "#6B4423",
  chocolate: "#4A2C1A",
  black: "#1A1A1A",
  grey: "#9E9E9E",
  gray: "#9E9E9E",
};

/** Names whose default finish is metallic when used as the accent. */
export const METALLIC_COLOR_NAMES: ReadonlySet<string> = new Set(["gold", "silver", "rose gold"]);

export function colorNameToHex(name: string): string | undefined {
  return COLOR_NAME_TO_HEX[name.trim().toLowerCase().replace(/\s+/g, " ")];
}

export function isMetallicColorName(name: string): boolean {
  return METALLIC_COLOR_NAMES.has(name.trim().toLowerCase());
}
