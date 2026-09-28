import React, { useState } from 'react';
import { ThemeSettings } from '../types';
import {
  PRESET_THEMES,
  getBackgroundStyle,
  getCardFrontStyle,
  getCardBackStyle,
  getBorderRadiusClass,
} from '../services/themePresets';
import { X, RotateCcw, Palette, Layout, Sparkles, Check, Sliders, Eye } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeSettings;
  onUpdateTheme: (newTheme: ThemeSettings) => void;
  onResetTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onUpdateTheme,
  onResetTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'cards' | 'layout'>('presets');
  const [previewFlipped, setPreviewFlipped] = useState(false);

  if (!isOpen) return null;

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    onUpdateTheme({
      ...theme,
      [key]: value,
    });
  };

  // Only clean, elegant blue, sky, azure, cyan, dark, and black tones (NO purple or green)
  const QUICK_ACCENT_COLORS = [
    { label: 'Açık Parlak Mavi (Varsayılan)', color: '#0284c7', light: '#38bdf8' },
    { label: 'Gökyüzü Mavisi', color: '#0ea5e9', light: '#7dd3fc' },
    { label: 'Buzul Mavisi', color: '#38bdf8', light: '#bae6fd' },
    { label: 'Canlı Turkuaz', color: '#06b6d4', light: '#67e8f9' },
    { label: 'Derin Deniz Mavisi', color: '#1d4ed8', light: '#60a5fa' },
    { label: 'Koyu Füme / Çelik', color: '#334155', light: '#94a3b8' },
    { label: 'Saf Siyah (#000)', color: '#000000', light: '#38bdf8' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-zinc-950 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: theme.accentColor }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Tasarım ve Renk Ayarları
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-400">
                Arka plan, gradyan, kartlar, EN/TR rozetleri ve cümle yazı renklerini özelleştirin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onResetTheme}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Varsayılan Beyaz & Parlak Mavi temaya dön"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sıfırla</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-100 dark:border-zinc-800 shrink-0 bg-slate-50/50 dark:bg-zinc-900/40 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'presets'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 dark:border-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hazır Temalar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'colors'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 dark:border-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Arka Plan & Gradyan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cards'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 dark:border-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kart, Rozet & Cümle Renkleri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('layout')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'layout'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 dark:border-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Yerleşim & Boyut</span>
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PRESET THEMES */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  Örnek Tasarım & Renk Şablonları
                </h3>
                <span className="text-[11px] text-slate-400">Tek tıkla uygulayabilirsiniz</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_THEMES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onUpdateTheme(preset.settings)}
                    className="p-3.5 rounded-2xl border text-left flex items-start gap-3.5 transition-all hover:shadow-md relative group bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700"
                    style={{
                      borderColor:
                        theme.accentColor === preset.settings.accentColor &&
                        theme.bgType === preset.settings.bgType &&
                        theme.bgColor === preset.settings.bgColor
                          ? preset.settings.accentColor
                          : undefined,
                    }}
                  >
                    {/* Visual Color Preview Dot / Circle */}
                    <div
                      className="w-12 h-12 rounded-xl shrink-0 shadow-xs border border-black/10 flex items-center justify-center relative overflow-hidden"
                      style={{ background: preset.previewBg }}
                    >
                      <div
                        className="w-4 h-4 rounded-md shadow-xs border border-white/50"
                        style={{ backgroundColor: preset.settings.accentColor }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {preset.name}
                        </h4>
                        {theme.accentColor === preset.settings.accentColor &&
                          theme.bgType === preset.settings.bgType &&
                          theme.bgColor === preset.settings.bgColor && (
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 text-[10px]"
                              style={{ backgroundColor: preset.settings.accentColor }}
                            >
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BACKGROUND & GRADIENT */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Background Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Arka Plan Türü
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => updateSetting('bgType', 'solid')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      theme.bgType === 'solid'
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300 shadow-2xs'
                        : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Düz Renk (Solid)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSetting('bgType', 'gradient')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      theme.bgType === 'gradient'
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300 shadow-2xs'
                        : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Gradyan (Gradient)
                  </button>
                </div>
              </div>

              {/* Solid Color Config */}
              {theme.bgType === 'solid' && (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Arka Plan Rengi (HTML / HEX Kodu)
                    </span>
                    <span className="text-[11px] text-slate-400">Örnek: #ffffff, #000000</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.bgColor.startsWith('#') ? theme.bgColor : '#ffffff'}
                      onChange={(e) => updateSetting('bgColor', e.target.value)}
                      className="w-11 h-11 rounded-xl cursor-pointer border border-slate-300 dark:border-zinc-700 p-0.5 bg-white"
                      title="Renk Seçici"
                    />
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={theme.bgColor}
                        onChange={(e) => updateSetting('bgColor', e.target.value)}
                        placeholder="#ffffff"
                        className="w-full font-mono text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 uppercase"
                      />
                    </div>
                  </div>

                  {/* Fast presets for white / clean tones and TRUE BLACK */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[11px] text-slate-400">Hızlı renkler:</span>
                    {[
                      { label: 'Saf Beyaz', hex: '#ffffff' },
                      { label: 'Açık Mavi Ton', hex: '#f0f9ff' },
                      { label: 'Açık Buzul', hex: '#f8fafc' },
                      { label: 'Tam Siyah (#000)', hex: '#000000' },
                      { label: 'Koyu Füme', hex: '#0a0a0a' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => {
                          updateSetting('bgColor', c.hex);
                          if (c.hex === '#000000' || c.hex === '#0a0a0a') {
                            updateSetting('textColor', '#ffffff');
                            updateSetting('cardBgColor', '#000000');
                            updateSetting('cardWordColor', '#ffffff');
                            updateSetting('cardBorderColor', '#262626');
                            updateSetting('badgeBgColor', '#18181b');
                            updateSetting('badgeTextColor', '#38bdf8');
                            updateSetting('sentenceBgColor', '#0a0a0a');
                            updateSetting('sentenceTextColor', '#e4e4e7');
                            updateSetting('sentenceBorderColor', '#27272a');
                          } else if (c.hex === '#ffffff' || c.hex === '#f0f9ff') {
                            updateSetting('textColor', '#0f172a');
                            updateSetting('cardBgColor', '#ffffff');
                            updateSetting('cardWordColor', '#0f172a');
                            updateSetting('cardBorderColor', '#e2e8f0');
                            updateSetting('badgeBgColor', '#f0f9ff');
                            updateSetting('badgeTextColor', '#0284c7');
                            updateSetting('sentenceBgColor', '#f8fafc');
                            updateSetting('sentenceTextColor', '#334155');
                            updateSetting('sentenceBorderColor', '#e2e8f0');
                          }
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-sky-400 transition-colors"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gradient Config */}
              {theme.bgType === 'gradient' && (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Gradyan Renkleri (2 Renk Geçişi)
                    </span>
                    <div
                      className="w-20 h-6 rounded-lg border border-slate-300 shadow-2xs"
                      style={{
                        background: `linear-gradient(${theme.bgGradientAngle}deg, ${theme.bgGradientColor1}, ${theme.bgGradientColor2})`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Color 1 */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        1. Başlangıç Rengi (HTML / HEX)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.bgGradientColor1.startsWith('#') ? theme.bgGradientColor1 : '#ffffff'}
                          onChange={(e) => updateSetting('bgGradientColor1', e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                        />
                        <input
                          type="text"
                          value={theme.bgGradientColor1}
                          onChange={(e) => updateSetting('bgGradientColor1', e.target.value)}
                          className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        />
                      </div>
                    </div>

                    {/* Color 2 */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        2. Bitiş Rengi (HTML / HEX)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.bgGradientColor2.startsWith('#') ? theme.bgGradientColor2 : '#e0f2fe'}
                          onChange={(e) => updateSetting('bgGradientColor2', e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                        />
                        <input
                          type="text"
                          value={theme.bgGradientColor2}
                          onChange={(e) => updateSetting('bgGradientColor2', e.target.value)}
                          className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gradient Angle */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600 dark:text-zinc-400">
                        Gradyan Açısı: {theme.bgGradientAngle}°
                      </span>
                      <div className="flex items-center gap-1">
                        {[45, 90, 135, 180].map((deg) => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => updateSetting('bgGradientAngle', deg)}
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              theme.bgGradientAngle === deg
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300'
                            }`}
                          >
                            {deg}°
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={theme.bgGradientAngle}
                      onChange={(e) => updateSetting('bgGradientAngle', parseInt(e.target.value, 10))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Accent Color Selection (Açık Parlak Mavi) */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      Vurgu ve İkinci Renk (Açık Parlak Mavi)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Butonlar, çeviri vurguları ve detaylar bu renkle gösterilir
                    </p>
                  </div>
                  <div
                    className="w-7 h-7 rounded-lg shadow-2xs border border-white"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.accentColor.startsWith('#') ? theme.accentColor : '#0284c7'}
                    onChange={(e) => {
                      updateSetting('accentColor', e.target.value);
                      updateSetting('cardTranslationColor', e.target.value);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => {
                      updateSetting('accentColor', e.target.value);
                      updateSetting('cardTranslationColor', e.target.value);
                    }}
                    placeholder="#0284c7"
                    className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                  />
                </div>

                {/* Quick Swatches (NO purple, NO green) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {QUICK_ACCENT_COLORS.map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => {
                        updateSetting('accentColor', item.color);
                        updateSetting('accentLightColor', item.light);
                        updateSetting('cardTranslationColor', item.color);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center gap-2 text-left hover:border-slate-400 transition-colors"
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-black/10"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 truncate">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARD, BADGE & SENTENCE STYLING */}
          {activeTab === 'cards' && (
            <div className="space-y-6">
              {/* SECTION: CARD COLORS */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-3">
                  1. Kart Gövdesi ve Kenarlık
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Card Solid Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Kart Gövde Rengi
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.cardBgColor.startsWith('#') ? theme.cardBgColor : '#ffffff'}
                        onChange={(e) => updateSetting('cardBgColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.cardBgColor}
                        onChange={(e) => updateSetting('cardBgColor', e.target.value)}
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Card Border Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Kart Kenarlık Rengi
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.cardBorderColor.startsWith('#') ? theme.cardBorderColor : '#e2e8f0'}
                        onChange={(e) => updateSetting('cardBorderColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.cardBorderColor}
                        onChange={(e) => updateSetting('cardBorderColor', e.target.value)}
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Card Word Text Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      İngilizce Kelime Rengi
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.cardWordColor.startsWith('#') ? theme.cardWordColor : '#0f172a'}
                        onChange={(e) => updateSetting('cardWordColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.cardWordColor}
                        onChange={(e) => updateSetting('cardWordColor', e.target.value)}
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Card Translation Text Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Türkçe Anlam Rengi
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.cardTranslationColor.startsWith('#') ? theme.cardTranslationColor : '#0284c7'}
                        onChange={(e) => updateSetting('cardTranslationColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.cardTranslationColor}
                        onChange={(e) => updateSetting('cardTranslationColor', e.target.value)}
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: EN / TR BADGE CUSTOMIZATION (User explicitly requested!) */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-1">
                  2. EN & TR Rozet Detayları (İnce Ayarlar)
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  Kartların üst köşelerindeki EN ve TR rozetlerinin arka plan ve yazı rengini belirleyin
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Badge Background Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Rozet Arka Plan Rengi
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.badgeBgColor.startsWith('#') ? theme.badgeBgColor : '#f0f9ff'}
                        onChange={(e) => updateSetting('badgeBgColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.badgeBgColor}
                        onChange={(e) => updateSetting('badgeBgColor', e.target.value)}
                        placeholder="#f0f9ff"
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Badge Text Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Rozet Yazı Rengi
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.badgeTextColor.startsWith('#') ? theme.badgeTextColor : '#0284c7'}
                        onChange={(e) => updateSetting('badgeTextColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.badgeTextColor}
                        onChange={(e) => updateSetting('badgeTextColor', e.target.value)}
                        placeholder="#0284c7"
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: SENTENCE TEXT & BOX CUSTOMIZATION (User explicitly requested!) */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-1">
                  3. Örnek Cümle Alanı (Yazı & Kutu Rengi)
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  &quot;Cümleyi Göster&quot; açıldığında cümlenin düz yazı rengini ve kutu arka planını belirleyin
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Sentence Text Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Cümle Yazı Rengi
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.sentenceTextColor.startsWith('#') ? theme.sentenceTextColor : '#334155'}
                        onChange={(e) => updateSetting('sentenceTextColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.sentenceTextColor}
                        onChange={(e) => updateSetting('sentenceTextColor', e.target.value)}
                        placeholder="#334155"
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Sentence Box Background Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Cümle Kutu Arka Planı
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.sentenceBgColor.startsWith('#') ? theme.sentenceBgColor : '#f8fafc'}
                        onChange={(e) => updateSetting('sentenceBgColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.sentenceBgColor}
                        onChange={(e) => updateSetting('sentenceBgColor', e.target.value)}
                        placeholder="#f8fafc"
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>

                  {/* Sentence Box Border Color */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                      Cümle Kutu Kenarlığı
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.sentenceBorderColor.startsWith('#') ? theme.sentenceBorderColor : '#e2e8f0'}
                        onChange={(e) => updateSetting('sentenceBorderColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.sentenceBorderColor}
                        onChange={(e) => updateSetting('sentenceBorderColor', e.target.value)}
                        placeholder="#e2e8f0"
                        className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  4. Kart Köşe Yuvarlaklığı
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'small', label: 'Hafif Yuvarlak', class: 'rounded-lg' },
                    { id: 'medium', label: 'Standart (Önerilen)', class: 'rounded-2xl' },
                    { id: 'large', label: 'Çok Yuvarlak', class: 'rounded-3xl' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => updateSetting('cardBorderRadius', r.id as ThemeSettings['cardBorderRadius'])}
                      className={`p-3 text-xs font-medium border text-center transition-all ${
                        theme.cardBorderRadius === r.id
                          ? 'border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-2xs font-semibold'
                          : 'border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
                      } ${r.class}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT & DENSITY */}
          {activeTab === 'layout' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Sayfa Düzeni & Kart Yoğunluğu
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Ekranda aynı anda kaç kelime kartı görmek istediğinizi belirleyin
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'compact',
                      title: 'Kompakt (Sıkı)',
                      desc: 'Daha küçük kartlar, masaüstünde 5-6 kart yan yana',
                    },
                    {
                      id: 'normal',
                      title: 'Standart (Dengeli)',
                      desc: 'İdeal e-ticaret düzeni, masaüstünde 4-5 kart',
                    },
                    {
                      id: 'spacious',
                      title: 'Geniş (Ferah)',
                      desc: 'Daha büyük yazı ve yüksek kartlar, masaüstünde 3-4 kart',
                    },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => updateSetting('cardDensity', d.id as ThemeSettings['cardDensity'])}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        theme.cardDensity === d.id
                          ? 'border-sky-600 bg-sky-50/70 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 shadow-xs'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <h4 className="text-xs font-bold mb-1">{d.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INTERACTIVE MINI LIVE PREVIEW (Shown at the bottom of all tabs) */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-500" />
                <span>Canlı Kart & Cümle Önizlemesi</span>
              </span>
              <span className="text-[11px] text-slate-400">Çevirmek için karta tıklayın</span>
            </div>

            <div
              className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-3"
              style={getBackgroundStyle(theme)}
            >
              {/* Flip Card Preview */}
              <div
                className={`w-64 h-36 perspective-1000 cursor-pointer select-none`}
                onClick={() => setPreviewFlipped((prev) => !prev)}
              >
                <div
                  className={`relative w-full h-full transform-style-3d transition-transform duration-350 shadow-sm ${getBorderRadiusClass(
                    theme.cardBorderRadius
                  )} ${previewFlipped ? 'rotate-y-180' : ''}`}
                >
                  {/* Front Preview */}
                  <div
                    className={`absolute inset-0 w-full h-full backface-hidden p-4 flex flex-col justify-between border ${getBorderRadiusClass(
                      theme.cardBorderRadius
                    )}`}
                    style={getCardFrontStyle(theme)}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border border-black/5"
                        style={{
                          backgroundColor: theme.badgeBgColor || '#f0f9ff',
                          color: theme.badgeTextColor || theme.accentColor,
                        }}
                      >
                        EN
                      </span>
                    </div>
                    <div className="my-auto text-center">
                      <h4
                        className="text-lg font-bold tracking-tight capitalize"
                        style={{ color: theme.cardWordColor }}
                      >
                        purchase
                      </h4>
                    </div>
                    <div className="text-center text-[10px] text-slate-400">
                      Anlamı görmek için dokun
                    </div>
                  </div>

                  {/* Back Preview */}
                  <div
                    className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-4 flex flex-col justify-between border ${getBorderRadiusClass(
                      theme.cardBorderRadius
                    )}`}
                    style={getCardBackStyle(theme)}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border border-black/5"
                        style={{
                          backgroundColor: theme.badgeBgColor || '#f0f9ff',
                          color: theme.badgeTextColor || theme.accentColor,
                        }}
                      >
                        TR
                      </span>
                    </div>
                    <div className="my-auto text-center">
                      <p
                        className="text-base font-semibold"
                        style={{ color: theme.cardTranslationColor }}
                      >
                        satın almak
                      </p>
                    </div>
                    <div className="text-center text-[10px] text-slate-400">
                      Ön yüze dönmek için dokun
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Sentence Box Preview */}
              <div
                className="w-64 p-2.5 rounded-xl border text-[11px] italic leading-relaxed"
                style={{
                  backgroundColor: theme.sentenceBgColor || '#f8fafc',
                  borderColor: theme.sentenceBorderColor || '#e2e8f0',
                  color: theme.sentenceTextColor || '#334155',
                }}
              >
                <span
                  className="font-bold not-italic block text-[9px] uppercase tracking-wider mb-0.5"
                  style={{ color: theme.accentColor }}
                >
                  Örnek Cümle (EN)
                </span>
                &ldquo;I want to purchase a new laptop.&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            Tüm renk değişiklikleri otomatik olarak kaydedilir.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-all active:scale-98"
            style={{ backgroundColor: theme.accentColor }}
          >
            Kaydet & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
