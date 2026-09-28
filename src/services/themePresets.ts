import { ThemeSettings, PresetTheme } from '../types';

export const DEFAULT_THEME: ThemeSettings = {
  bgType: 'solid',
  bgColor: '#ffffff',
  bgGradientColor1: '#ffffff',
  bgGradientColor2: '#f0f9ff',
  bgGradientAngle: 135,

  accentColor: '#0284c7', // Açık parlak mavi (Sky blue 600)
  accentLightColor: '#38bdf8', // Açık parlak mavi (Sky blue 400)

  textColor: '#0f172a',
  textMutedColor: '#64748b',

  cardBgType: 'solid',
  cardBgColor: '#ffffff',
  cardBgGradientColor1: '#ffffff',
  cardBgGradientColor2: '#f8fafc',
  cardBgGradientAngle: 180,
  cardBorderColor: '#e2e8f0',
  cardWordColor: '#0f172a',
  cardTranslationColor: '#0284c7',
  cardBorderRadius: 'medium',

  // EN / TR Badge Details
  badgeBgColor: '#f0f9ff',
  badgeTextColor: '#0284c7',

  // Sentence Custom Color & Background
  sentenceTextColor: '#334155',
  sentenceBgColor: '#f8fafc',
  sentenceBorderColor: '#e2e8f0',

  cardDensity: 'normal',
};

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'white-sky',
    name: 'Beyaz & Parlak Mavi',
    description: 'Saf beyaz arka plan ve açık parlak mavi detaylar (Varsayılan)',
    previewBg: 'linear-gradient(135deg, #ffffff 60%, #38bdf8 100%)',
    settings: {
      ...DEFAULT_THEME,
    },
  },
  {
    id: 'ocean-gradient',
    name: 'Açık Mavi Gradyan',
    description: 'Ferahlatıcı gökyüzü ve açık mavi gradyan arka plan',
    previewBg: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)',
    settings: {
      ...DEFAULT_THEME,
      bgType: 'gradient',
      bgGradientColor1: '#f0f9ff',
      bgGradientColor2: '#e0f2fe',
      bgGradientAngle: 135,
      accentColor: '#0284c7',
      accentLightColor: '#38bdf8',
      cardBgColor: '#ffffff',
      cardBorderColor: '#bae6fd',
      cardTranslationColor: '#0284c7',
      badgeBgColor: '#e0f2fe',
      badgeTextColor: '#0284c7',
      sentenceBgColor: '#f0f9ff',
      sentenceBorderColor: '#bae6fd',
    },
  },
  {
    id: 'azure-vibrant',
    name: 'Canlı Azure & Cam Efekti',
    description: 'Canlı turkuaz-mavi gradyan ve kontrast beyaz kartlar',
    previewBg: 'linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 100%)',
    settings: {
      ...DEFAULT_THEME,
      bgType: 'gradient',
      bgGradientColor1: '#f8fafc',
      bgGradientColor2: '#e0f2fe',
      bgGradientAngle: 120,
      accentColor: '#0284c7',
      accentLightColor: '#0ea5e9',
      cardBgColor: '#ffffff',
      cardBorderColor: '#cbd5e1',
      cardTranslationColor: '#0369a1',
      badgeBgColor: '#e0f2fe',
      badgeTextColor: '#0369a1',
      sentenceBgColor: '#f8fafc',
      sentenceBorderColor: '#cbd5e1',
    },
  },
  {
    id: 'true-black-neon',
    name: 'Tam Siyah (#000) & Parlak Mavi',
    description: 'Tamamen siyah (#000000) arka plan ve parlak mavi vurgular',
    previewBg: 'linear-gradient(135deg, #000000 65%, #0284c7 100%)',
    settings: {
      ...DEFAULT_THEME,
      bgType: 'solid',
      bgColor: '#000000',
      textColor: '#ffffff',
      textMutedColor: '#94a3b8',
      accentColor: '#38bdf8',
      accentLightColor: '#7dd3fc',
      cardBgType: 'solid',
      cardBgColor: '#000000',
      cardBorderColor: '#262626',
      cardWordColor: '#ffffff',
      cardTranslationColor: '#38bdf8',
      badgeBgColor: '#111827',
      badgeTextColor: '#38bdf8',
      sentenceBgColor: '#0a0a0a',
      sentenceTextColor: '#e2e8f0',
      sentenceBorderColor: '#262626',
    },
  },
  {
    id: 'deep-black-minimal',
    name: 'Tam Siyah Minimal Kartlar',
    description: '#000000 arka plan, koyu füme kartlar ve saf beyaz yazılar',
    previewBg: 'linear-gradient(135deg, #000000 50%, #1e293b 100%)',
    settings: {
      ...DEFAULT_THEME,
      bgType: 'solid',
      bgColor: '#000000',
      textColor: '#ffffff',
      textMutedColor: '#94a3b8',
      accentColor: '#0ea5e9',
      accentLightColor: '#38bdf8',
      cardBgType: 'solid',
      cardBgColor: '#0d0d0d',
      cardBorderColor: '#222222',
      cardWordColor: '#ffffff',
      cardTranslationColor: '#0ea5e9',
      badgeBgColor: '#18181b',
      badgeTextColor: '#0ea5e9',
      sentenceBgColor: '#050505',
      sentenceTextColor: '#e4e4e7',
      sentenceBorderColor: '#27272a',
    },
  },
];

export function getBackgroundStyle(theme: ThemeSettings): React.CSSProperties {
  if (theme.bgType === 'gradient') {
    return {
      background: `linear-gradient(${theme.bgGradientAngle}deg, ${theme.bgGradientColor1} 0%, ${theme.bgGradientColor2} 100%)`,
    };
  }
  return {
    backgroundColor: theme.bgColor,
  };
}

export function getCardFrontStyle(theme: ThemeSettings): React.CSSProperties {
  const base: React.CSSProperties = {
    borderColor: theme.cardBorderColor,
  };
  if (theme.cardBgType === 'gradient') {
    base.background = `linear-gradient(${theme.cardBgGradientAngle}deg, ${theme.cardBgGradientColor1} 0%, ${theme.cardBgGradientColor2} 100%)`;
  } else {
    base.backgroundColor = theme.cardBgColor;
  }
  return base;
}

export function getCardBackStyle(theme: ThemeSettings): React.CSSProperties {
  const base: React.CSSProperties = {
    borderColor: theme.cardBorderColor,
  };
  if (theme.cardBgType === 'gradient') {
    base.background = `linear-gradient(${theme.cardBgGradientAngle}deg, ${theme.cardBgGradientColor2} 0%, ${theme.cardBgGradientColor1} 100%)`;
  } else {
    if (theme.cardBgColor === '#ffffff') {
      base.backgroundColor = '#f8fafc';
    } else if (theme.cardBgColor === '#000000') {
      base.backgroundColor = '#0a0a0a';
    } else {
      base.backgroundColor = theme.cardBgColor;
    }
  }
  return base;
}

export function getBorderRadiusClass(radius: ThemeSettings['cardBorderRadius']): string {
  switch (radius) {
    case 'small':
      return 'rounded-lg';
    case 'large':
      return 'rounded-3xl';
    case 'medium':
    default:
      return 'rounded-2xl';
  }
}

export function getDensityConfig(density: ThemeSettings['cardDensity']) {
  switch (density) {
    case 'compact':
      return {
        cardHeightClass: 'h-36 sm:h-40',
        wordTextClass: 'text-lg sm:text-xl',
        gridColsClass: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4',
      };
    case 'spacious':
      return {
        cardHeightClass: 'h-52 sm:h-56',
        wordTextClass: 'text-2xl sm:text-3xl',
        gridColsClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6',
      };
    case 'normal':
    default:
      return {
        cardHeightClass: 'h-44 sm:h-48',
        wordTextClass: 'text-xl sm:text-2xl',
        gridColsClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5',
      };
  }
}
