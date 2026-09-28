import React, { useState } from 'react';
import { Word, ThemeSettings } from '../types';
import { ChevronDown, ChevronUp, Trash2, RotateCw } from 'lucide-react';
import {
  getCardFrontStyle,
  getCardBackStyle,
  getBorderRadiusClass,
  getDensityConfig,
} from '../services/themePresets';

interface WordCardProps {
  item: Word;
  theme: ThemeSettings;
  onDelete?: (id: string) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ item, theme, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const densityConfig = getDensityConfig(theme.cardDensity);
  const radiusClass = getBorderRadiusClass(theme.cardBorderRadius);

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleToggleSentence = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSentence((prev) => !prev);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
      return;
    }
    if (onDelete) {
      onDelete(item.id);
    }
  };

  const frontStyle = getCardFrontStyle(theme);
  const backStyle = getCardBackStyle(theme);

  return (
    <div className="flex flex-col w-full group">
      {/* 3D Flip Card Container */}
      <div
        className={`w-full ${densityConfig.cardHeightClass} perspective-1000 cursor-pointer select-none`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`Kelime kartı: ${item.word}. Çevirmek için tıklayın.`}
      >
        <div
          className={`relative w-full h-full ${radiusClass} transform-style-3d transition-transform duration-350 ease-out shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face: English Word */}
          <div
            className={`absolute inset-0 w-full h-full ${radiusClass} backface-hidden p-5 flex flex-col justify-between border transition-all`}
            style={frontStyle}
          >
            {/* Top row: Language indicator & Delete */}
            <div className="flex items-center justify-between text-xs font-medium">
              <span
                className="px-2 py-0.5 rounded-full font-mono tracking-wider text-[11px] font-semibold border border-black/5"
                style={{
                  backgroundColor: theme.badgeBgColor || '#f0f9ff',
                  color: theme.badgeTextColor || theme.accentColor,
                }}
              >
                EN
              </span>

              {onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  title={showDeleteConfirm ? 'Silmek için tekrar tıkla' : 'Kelimeyi sil'}
                  className={`p-1 rounded-md transition-colors ${
                    showDeleteConfirm
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'text-slate-300 hover:text-rose-500'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Center: English Word */}
            <div className="my-auto text-center px-2">
              <h3
                className={`${densityConfig.wordTextClass} font-bold tracking-tight capitalize break-words`}
                style={{ color: theme.cardWordColor }}
              >
                {item.word}
              </h3>
            </div>

            {/* Bottom: Flip Hint */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-normal">
              <RotateCw className="w-3 h-3 text-slate-400" />
              <span>Anlamı görmek için dokun</span>
            </div>
          </div>

          {/* Back Face: Turkish Meaning */}
          <div
            className={`absolute inset-0 w-full h-full ${radiusClass} backface-hidden rotate-y-180 p-5 flex flex-col justify-between border transition-all`}
            style={backStyle}
          >
            {/* Top row */}
            <div className="flex items-center justify-between text-xs font-medium">
              <span
                className="px-2 py-0.5 rounded-full font-mono tracking-wider text-[11px] font-semibold border border-black/5"
                style={{
                  backgroundColor: theme.badgeBgColor || '#f0f9ff',
                  color: theme.badgeTextColor || theme.accentColor,
                }}
              >
                TR
              </span>
              <span className="text-[11px] text-slate-400">Türkçe Karşılığı</span>
            </div>

            {/* Center: Turkish Meaning in vivid bright accent blue */}
            <div className="my-auto text-center px-2">
              <p
                className={`${densityConfig.wordTextClass} font-semibold break-words`}
                style={{ color: theme.cardTranslationColor }}
              >
                {item.translation}
              </p>
            </div>

            {/* Bottom: Flip Hint */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-normal">
              <RotateCw className="w-3 h-3 text-slate-400" />
              <span>Ön yüze dönmek için dokun</span>
            </div>
          </div>
        </div>
      </div>

      {/* "Cümleyi Göster" Action Button */}
      <div className="mt-2.5 flex flex-col">
        <button
          type="button"
          onClick={handleToggleSentence}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium bg-white/90 hover:bg-white text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs hover:border-slate-300 transition-all"
        >
          <span style={{ color: showSentence ? theme.accentColor : undefined }}>
            {showSentence ? 'Cümleyi Gizle' : 'Cümleyi Göster'}
          </span>
          {showSentence ? (
            <ChevronUp
              className="w-3.5 h-3.5 transition-transform"
              style={{ color: theme.accentColor }}
            />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* English Example Sentence Drawer (STRICTLY NO TURKISH TRANSLATION) */}
        {showSentence && (
          <div
            className="mt-2 p-3.5 rounded-xl border text-xs italic shadow-2xs leading-relaxed animate-fadeIn"
            style={{
              backgroundColor: theme.sentenceBgColor || '#f8fafc',
              borderColor: theme.sentenceBorderColor || '#e2e8f0',
              color: theme.sentenceTextColor || '#334155',
            }}
          >
            <span
              className="font-bold not-italic block text-[10px] uppercase tracking-wider mb-1"
              style={{ color: theme.accentColor }}
            >
              Örnek Cümle (EN)
            </span>
            &ldquo;{item.sentence}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};
