import type { TextStyle } from "react-native";

// Mobile theme: the same "panaderya" world as the website. Glass-white room, committed rose,
// card-stock white for price cards and order slips. Fonts are the website's (Bricolage Grotesque for
// headings, Hanken Grotesk for UI, Caveat for prices), loaded in app/_layout.tsx.
export const c = {
  cream: "#F4F3F1",
  ink: "#231A1D",
  muted: "#66595D",
  line: "#E2DDDB",
  card: "#FFFDF8",
  stockLine: "#E6DFD0",
  rose: "#9B5568",
  roseDark: "#7F4256",
  roseTint: "#F4E3E7",
  danger: "#B3261E",
  green: "#1D4519",
  greenBg: "#CFE6C8",
  preBg: "#F8DFA8",
  preText: "#5A3D00",
  soldBg: "#DCDAD8",
  soldText: "#3B3536",
} as const;

/** Font family names registered by expo-font in app/_layout.tsx. */
export const font = {
  display: "BricolageGrotesque_700Bold",
  body: "HankenGrotesk_400Regular",
  bodyBold: "HankenGrotesk_600SemiBold",
  price: "Caveat_600SemiBold",
} as const;

export const serif: TextStyle = { fontFamily: font.display, letterSpacing: -0.5 };
export const MIN_TOUCH = 48;
/** Corner radii: 8 for surfaces, 10 for controls, 2 for tape. */
export const radius = { card: 8, control: 10, tape: 2 } as const;
