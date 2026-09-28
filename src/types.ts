export interface Word {
  id: string;
  word: string;
  translation: string;
  sentence: string;
  createdAt?: number;
}

export type BackgroundType = 'solid' | 'gradient';
export type CardBgType = 'solid' | 'gradient';
export type BorderRadiusType = 'small' | 'medium' | 'large';
export type CardDensity = 'compact' | 'normal' | 'spacious';

export interface ThemeSettings {
  // App Background
  bgType: BackgroundType;
  bgColor: string; // HTML Hex color, e.g. '#ffffff'
  bgGradientColor1: string;
  bgGradientColor2: string;
  bgGradientAngle: number; // e.g. 135

  // Primary Accent Color (Varsayılan açık parlak mavi)
  accentColor: string; // e.g. '#0284c7' or '#0ea5e9'
  accentLightColor: string; // e.g. '#38bdf8'

  // Text Colors
  textColor: string; // e.g. '#0f172a'
  textMutedColor: string; // e.g. '#64748b'

  // Card Settings
  cardBgType: CardBgType;
  cardBgColor: string; // e.g. '#ffffff'
  cardBgGradientColor1: string;
  cardBgGradientColor2: string;
  cardBgGradientAngle: number;
  cardBorderColor: string; // e.g. '#e2e8f0'
  cardWordColor: string; // e.g. '#0f172a'
  cardTranslationColor: string; // e.g. '#0284c7'
  cardBorderRadius: BorderRadiusType; // 'small' | 'medium' | 'large'

  // EN / TR Badge Details
  badgeBgColor: string; // e.g. '#f0f9ff'
  badgeTextColor: string; // e.g. '#0284c7'

  // Sentence Custom Color & Background
  sentenceTextColor: string; // e.g. '#334155'
  sentenceBgColor: string; // e.g. '#f8fafc'
  sentenceBorderColor: string; // e.g. '#e2e8f0'

  // Layout Density & Card Height
  cardDensity: CardDensity;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  previewBg: string;
  settings: ThemeSettings;
}

