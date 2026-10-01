import { Platform, type TextStyle } from "react-native";

// Mobile app theme (see Design.pdf). Mirrors the website palette. Custom fonts (Cormorant Garamond /
// DM Sans) are not bundled yet; the platform serif is used for headings until they are.
export const c = {
  cream: "#F5F1EC",
  ink: "#2A2019",
  muted: "#6F635A",
  line: "#E1D8CE",
  card: "#FFFFFF",
  rose: "#9B5568",
  roseDark: "#7F4256",
  danger: "#B3261E",
  green: "#3C5A3A",
  greenBg: "#E0EADB",
  preBg: "#EEE6DC",
  soldBg: "#F2DCDF",
  soldText: "#8A3A46",
} as const;

export const serif: TextStyle = { fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }), fontWeight: "500" };
export const MIN_TOUCH = 48;
