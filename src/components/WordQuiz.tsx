import { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { Word } from '../types';

const QUESTION_COUNT = 100;

type QuizQuestion = {
  word: Word;
  options: string[];
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createQuizDeck(words: Word[]): QuizQuestion[] {
  const translationMap = new Map<string, string>();
  for (const word of words) {
    const translation = word.translation.trim();
    const normalized = translation.toLocaleLowerCase('tr-TR');
    if (translation && !translationMap.has(normalized)) translationMap.set(normalized, translation);
  }
  const translations = [...translationMap.values()];
  const eligibleWords = words.filter((word) =>
    translationMap.has(word.translation.trim().toLocaleLowerCase('tr-TR'))
  );
  if (translations.length < 5 || eligibleWords.length === 0) return [];

  const questionWords: Word[] = [];
  while (questionWords.length < QUESTION_COUNT) {
    const nextRound = shuffle(eligibleWords);
    if (
      questionWords.length > 0 && nextRound.length > 1 &&
      nextRound[0].id === questionWords[questionWords.length - 1].id
    ) [nextRound[0], nextRound[1]] = [nextRound[1], nextRound[0]];
    questionWords.push(...nextRound.slice(0, QUESTION_COUNT - questionWords.length));
  }

  return questionWords.map((word) => {
    const answer = word.translation.trim();
    const distractors = shuffle(translations.filter((translation) =>
      translation.toLocaleLowerCase('tr-TR') !== answer.toLocaleLowerCase('tr-TR')
    )).slice(0, 4);
    return { word, options: shuffle([answer, ...distractors]) };
  });
}

export function WordQuiz({ words }: { words: Word[] }) {
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const distinctTranslationCount = new Set(
    words.map((word) => word.translation.trim().toLocaleLowerCase('tr-TR')).filter(Boolean)
  ).size;

  const startGame = () => {
    setDeck(createQuizDeck(words));
    setQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setStatus('playing');
  };

  const handleAnswer = (option: string) => {
    if (selectedOption !== null || status !== 'playing') return;
    setSelectedOption(option);
    if (option === deck[questionIndex].word.translation.trim()) {
      setScore((current) => current + 1);
      if (questionIndex === QUESTION_COUNT - 1) setStatus('won');
    } else {
      setStatus('lost');
    }
  };

  const goToNextQuestion = () => {
    setQuestionIndex((current) => current + 1);
    setSelectedOption(null);
  };

  const currentQuestion = deck[questionIndex];

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Kelime Oyunu</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">İngilizce karşılığını bul</h2>
        </div>
        {status !== 'idle' && (
          <div className="text-right text-sm text-slate-500 dark:text-slate-400">
            <div className="font-semibold text-slate-800 dark:text-slate-100">Puan: {score} / {QUESTION_COUNT}</div>
            <div>{Math.min(questionIndex + (status === 'won' ? 1 : 0), QUESTION_COUNT)} / {QUESTION_COUNT} soru</div>
          </div>
        )}
      </div>

      {status === 'idle' && (
        <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Her soruda kelimenin Türkçe anlamını seç. Yanlış cevap oyunu bitirir; 100 soruyu tamamlarsan kazanırsın.
          </p>
          {distinctTranslationCount < 5 ? (
            <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              Oyun için en az 5 farklı Türkçe anlam içeren kelime gerekir. Şu an {distinctTranslationCount} farklı anlam var.
            </p>
          ) : (
            <button type="button" onClick={startGame} className="mt-6 rounded-lg bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800">
              Oyuna Başla
            </button>
          )}
        </div>
      )}

      {status === 'playing' && currentQuestion && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-sky-600 transition-[width] duration-300" style={{ width: `${(questionIndex / QUESTION_COUNT) * 100}%` }} />
          </div>
          <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">Bu kelimenin Türkçe anlamı nedir?</p>
          <h3 className="mb-7 break-words text-3xl font-bold text-slate-900 dark:text-white">{currentQuestion.word.word}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={`${questionIndex}-${index}`}
                type="button"
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(option)}
                className={`min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default ${
                  selectedOption === option
                    ? option === currentQuestion.word.translation.trim()
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span className="mr-3 text-xs text-slate-400">{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            ))}
          </div>
          {selectedOption !== null && status === 'playing' && (
            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300"><Check className="h-4 w-4" /> Doğru cevap</p>
              <button type="button" onClick={goToNextQuestion} className="rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800">Sonraki Soru</button>
            </div>
          )}
        </div>
      )}

      {(status === 'won' || status === 'lost') && (
        <div className={`rounded-xl border p-7 text-center shadow-sm ${status === 'won' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30' : 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30'}`}>
          {status === 'won' ? <Check className="mx-auto h-9 w-9 text-emerald-600" /> : <X className="mx-auto h-9 w-9 text-rose-600" />}
          <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{status === 'won' ? 'Tebrikler!' : 'Yanlış, kaybettin.'}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Puanın: {score} / {QUESTION_COUNT}</p>
          <button type="button" onClick={startGame} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            <RotateCcw className="h-4 w-4" /> Yeniden Oyna
          </button>
        </div>
      )}
    </section>
  );
}