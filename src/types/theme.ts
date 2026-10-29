export type ThemePresetId =
  | 'midnight-aurora'
  | 'warm-paper'
  | 'forest-focus'
  | 'lavender-dream'
  | 'obsidian'
  | 'ember-sunset';

// Backward compatibility alias
export type ThemeId = ThemePresetId | string;

export interface ThemeConfig {
  id: string;
  name: string;
  imageUrl?: string;
  fallbackGradient?: string;
  particleStyle?: 'rain' | 'stars' | 'petals' | 'sparkle' | 'dust' | 'none';
  [key: string]: any;
}

export interface ThemeColors {
  mainBg: string;
  sidebarBg: string;
  cardBg: string;
  elevatedBg: string;
  primaryAccent: string;
  hoverAccent: string;
  accentGlow: string;
  primaryText: string;
  secondaryText: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  tagline: string;
  isLight: boolean;
  colors: ThemeColors;
  swatches: [string, string, string, string]; // [mainBg, cardBg, accent, text]
  defaultAmbientPreset?: AmbientPresetId;
}

export type AmbientPresetId =
  | 'none'
  | 'rainy'
  | 'library'
  | 'forest'
  | 'ocean'
  | 'space';

export interface AmbientPreset {
  id: AmbientPresetId;
  name: string;
  tagline: string;
  imageUrl?: string;
}

export interface ThemeCustomization {
  activeThemeId: ThemePresetId;
  customAccentColor: string | null; // e.g. '#43E6C3' or null for theme default
  ambientPresetId: AmbientPresetId;
  ambientDimming: number; // 0 to 1 (default 0.7)
  enableAmbientVisuals: boolean;
}
