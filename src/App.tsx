/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Word, ThemeSettings } from './types';
import { fetchWords, addWord, deleteWord, downloadWordsJson } from './services/wordService';
import {
  DEFAULT_THEME,
  PRESET_THEMES,
  getBackgroundStyle,
  getDensityConfig,
} from './services/themePresets';
import { WordCard } from './components/WordCard';
import { AddWordModal } from './components/AddWordModal';
import { SettingsModal } from './components/SettingsModal';
import {
  Plus,
  Sun,
  Moon,
  Search,
  BookOpen,
  Download,
  Check,
  Settings as SettingsIcon,
} from 'lucide-react';

const THEME_STORAGE_KEY = 'my_english_words_custom_theme_v2';

export default function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Custom Theme state with local persistence
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_THEME, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Tema ayarları yüklenemedi:', e);
    }
    return DEFAULT_THEME;
  });

  // Save theme on change
  const handleUpdateTheme = (newTheme: ThemeSettings) => {
    setThemeSettings(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    } catch (e) {
      console.warn('Tema kaydedilemedi:', e);
    }
  };

  const handleResetTheme = () => {
    setThemeSettings(DEFAULT_THEME);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(DEFAULT_THEME));
    } catch (e) {
      console.warn(e);
    }
    showToast('Tasarım varsayılan Beyaz & Parlak Mavi temaya sıfırlandı.');
  };

  // Toggle quick dark / light mode (Tam #000 Siyah desteği)
  const isDarkTheme =
    themeSettings.bgColor === '#000000' ||
    themeSettings.bgColor === '#000' ||
    themeSettings.bgColor === '#090d16' ||
    themeSettings.bgColor === '#0d0d0d';

  const toggleQuickDarkTheme = () => {
    if (isDarkTheme) {
      // Switch to default White & Bright Light Blue
      handleUpdateTheme(DEFAULT_THEME);
      showToast('Beyaz & Parlak Mavi temaya geçildi.');
    } else {
      // Switch to True Black (#000000) preset
      const darkPreset = PRESET_THEMES.find((p) => p.id === 'true-black-neon');
      if (darkPreset) {
        handleUpdateTheme(darkPreset.settings);
        showToast('Tam Siyah (#000) temaya geçildi.');
      }
    }
  };

  // Load words on initial mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchWords();
        setWords(data);
      } catch (err) {
        console.error('Kelime verileri yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddWord = async (newWordData: { word: string; translation: string; sentence: string }) => {
    const saved = await addWord(newWordData);
    setWords((prev) => [saved, ...prev.filter((w) => w.id !== saved.id)]);
    showToast('Yeni kelime başarıyla eklendi!');
  };

  const handleDeleteWord = async (id: string) => {
    await deleteWord(id);
    setWords((prev) => prev.filter((w) => w.id !== id));
    showToast('Kelime silindi.');
  };

  // Filtered words for instant search
  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) return words;
    const q = searchTerm.toLowerCase().trim();
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        w.sentence.toLowerCase().includes(q)
    );
  }, [words, searchTerm]);

  const densityConfig = getDensityConfig(themeSettings.cardDensity);
  const bgStyle = getBackgroundStyle(themeSettings);

  return (
    <div
      className="min-h-screen text-slate-800 transition-colors duration-200 flex flex-col"
      style={{
        ...bgStyle,
        color: themeSettings.textColor,
      }}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium animate-fadeIn border border-slate-700">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modern, Clean Header with White & Bright Light Blue accents */}
      <header
        className="sticky top-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 transition-colors"
        style={{
          backgroundColor:
            themeSettings.bgColor === '#000000' || themeSettings.bgColor === '#000'
              ? '#000000ee'
              : undefined,
          borderColor:
            themeSettings.bgColor === '#000000' || themeSettings.bgColor === '#000'
              ? '#262626'
              : undefined,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-xs transition-colors"
              style={{ backgroundColor: themeSettings.accentColor }}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  My English Words
                </h1>
                <span
                  className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border border-black/5"
                  style={{
                    backgroundColor: themeSettings.badgeBgColor || `${themeSettings.accentColor}15`,
                    color: themeSettings.badgeTextColor || themeSettings.accentColor,
                  }}
                >
                  {words.length} kelime
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
                Kişisel Kelime Kartları
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Dark/Light Toggle */}
            <button
              type="button"
              onClick={toggleQuickDarkTheme}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title={isDarkTheme ? 'Açık Beyaz Temaya Geç' : 'Tam Siyah (#000) Temaya Geç'}
              aria-label="Hızlı Tema Değiştir"
            >
              {isDarkTheme ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">Beyaz Tema</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span className="hidden md:inline">Tam Siyah</span>
                </>
              )}
            </button>

            {/* Custom Theme & Settings Page Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-2xs"
              title="Tasarım, Renk ve Gradyan Ayarları"
            >
              <SettingsIcon className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Ayarlar & Renkler</span>
            </button>

            {/* Export JSON Button */}
            <button
              type="button"
              onClick={() => downloadWordsJson(words)}
              className="hidden lg:flex items-center gap-1.5 p-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-xs font-medium"
              title="Kelimeleri JSON Olarak İndir"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>JSON İndir</span>
            </button>

            {/* Kelime Ekle Button (Single '+' only!) */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs hover:brightness-105 transition-all active:scale-98"
              style={{ backgroundColor: themeSettings.accentColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Kelime Ekle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kelime veya anlam ara..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Temizle
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Gösterilen: <strong className="text-slate-800 dark:text-slate-200">{filteredWords.length}</strong> / {words.length} kelime
            </span>
          </div>
        </div>

        {/* Word Cards Grid:
            - Fully responsive based on chosen density layout:
            - Desktop: 4-5 cards (or 5-6 in compact, 3-4 in spacious)
            - Tablet: 2-3 cards
            - Mobile: 1-2 cards
        */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-sm">
            <div
              className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mb-3"
              style={{ borderColor: themeSettings.accentColor, borderTopColor: 'transparent' }}
            />
            <span>Kelimeler yükleniyor...</span>
          </div>
        ) : filteredWords.length > 0 ? (
          <div className={`grid ${densityConfig.gridColsClass}`}>
            {filteredWords.map((item) => (
              <WordCard
                key={item.id}
                item={item}
                theme={themeSettings}
                onDelete={handleDeleteWord}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              {searchTerm ? 'Aranan kelime bulunamadı' : 'Henüz kelime eklenmedi'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
              {searchTerm
                ? 'Farklı bir arama terimi deneyebilir ya da aramayı temizleyebilirsiniz.'
                : 'Öğrenmek istediğiniz ilk İngilizce kelimeyi ekleyerek başlayın.'}
            </p>
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                Aramayı Temizle
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
                style={{ backgroundColor: themeSettings.accentColor }}
              >
                <Plus className="w-4 h-4" />
                <span>İlk Kelimeni Ekle</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* Simple, Minimal Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/60 dark:border-slate-800/80 text-center text-xs text-slate-400">
        <p>Kartların üzerine dokunarak Türkçe anlamlarını görebilirsiniz.</p>
      </footer>

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWord={handleAddWord}
        accentColor={themeSettings.accentColor}
      />

      {/* Settings Modal (Theme, Color Picker, Gradients, Layout) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={themeSettings}
        onUpdateTheme={handleUpdateTheme}
        onResetTheme={handleResetTheme}
      />
    </div>
  );
}
