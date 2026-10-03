export const colors = {
  background: "#F4F3F1",
  surface: "#FFFDF8",
  text: "#231A1D",
  textMuted: "#66595D",
  border: "#D6CFCC",
  primary: "#9B5568",
  onPrimary: "#FFFFFF",
  danger: "#B3261E",
  adminBar: "#3A2229",
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 } as const;
/** Corner radii: 8 for surfaces, 10 for controls. */
export const radii = { md: 10, lg: 8 } as const;
/** Minimum touch target (px) for mobile accessibility. */
export const MIN_TOUCH = 48;
