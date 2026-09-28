import React, { useState } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (data: { word: string; translation: string; sentence: string }) => Promise<void>;
  accentColor?: string;
}

export const AddWordModal: React.FC<AddWordModalProps> = ({
  isOpen,
  onClose,
  onAddWord,
  accentColor = '#0284c7',
}) => {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [sentence, setSentence] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedWord = word.trim();
    const trimmedTranslation = translation.trim();
    const trimmedSentence = sentence.trim();

    if (!trimmedWord || !trimmedTranslation || !trimmedSentence) {
      setErrorMessage('Lütfen 3 alanı da eksiksiz doldurun. Tüm alanlar zorunludur.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await onAddWord({
        word: trimmedWord,
        translation: trimmedTranslation,
        sentence: trimmedSentence,
      });

      // Clear form and close
      setWord('');
      setTranslation('');
      setSentence('');
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('Kelime kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-7 relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-white shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Yeni Kelime Ekle
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation warning */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              İngilizce Kelime <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Örnek: purchase"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Türkçe Anlamı <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Örnek: satın almak"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              İngilizce Örnek Cümle <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="Örnek: I want to purchase a new laptop."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Not: Bu cümle kartın altında &quot;Cümleyi Göster&quot; butonuna basıldığında görüntülenecektir.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-50 shadow-xs hover:brightness-105 active:scale-98"
              style={{ backgroundColor: accentColor }}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kelimeyi Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
