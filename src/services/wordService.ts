import { Word } from '../types';

const STORAGE_KEY = 'my_english_words_data';

const DEFAULT_INITIAL_WORDS: Word[] = [
  {
    id: "1",
    word: "purchase",
    translation: "satın almak",
    sentence: "I want to purchase a new laptop."
  },
  {
    id: "2",
    word: "improve",
    translation: "geliştirmek",
    sentence: "I want to improve my English speaking skills."
  },
  {
    id: "3",
    word: "achieve",
    translation: "başarmak, elde etmek",
    sentence: "You can achieve your goals if you practice consistently."
  },
  {
    id: "4",
    word: "consider",
    translation: "göz önünde bulundurmak, düşünmek",
    sentence: "Please consider all options before making a final decision."
  },
  {
    id: "5",
    word: "opportunity",
    translation: "fırsat, imkan",
    sentence: "This job offer is a great opportunity for your career."
  },
  {
    id: "6",
    word: "essential",
    translation: "temel, zorunlu, gerekli",
    sentence: "Consistent practice is essential to learn any language."
  },
  {
    id: "7",
    word: "discover",
    translation: "keşfetmek",
    sentence: "They traveled around the world to discover new cultures."
  },
  {
    id: "8",
    word: "challenge",
    translation: "zorluk, meydan okuma",
    sentence: "Learning a new skill is always an exciting challenge."
  }
];

function getLocalWords(): Word[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('LocalStorage okuma hatası:', err);
  }
  return DEFAULT_INITIAL_WORDS;
}

function saveLocalWords(words: Word[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch (err) {
    console.warn('LocalStorage yazma hatası:', err);
  }
}

export async function fetchWords(): Promise<Word[]> {
  try {
    const res = await fetch('/api/words');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        saveLocalWords(data);
        return data;
      }
    }
  } catch (err) {
    console.info('Backend API erişilemedi, LocalStorage verisi kullanılıyor:', err);
  }
  return getLocalWords();
}

export async function addWord(payload: { word: string; translation: string; sentence: string }): Promise<Word> {
  const localList = getLocalWords();
  const fallbackWord: Word = {
    id: Date.now().toString(),
    word: payload.word.trim(),
    translation: payload.translation.trim(),
    sentence: payload.sentence.trim(),
  };

  try {
    const res = await fetch('/api/words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const savedWord = await res.json();
      const updated = [savedWord, ...localList.filter((w) => w.id !== savedWord.id)];
      saveLocalWords(updated);
      return savedWord;
    }
  } catch (err) {
    console.info('Backend API çağrısı yapılamadı, yerel olarak kaydediliyor:', err);
  }

  // Fallback to local storage
  const updated = [fallbackWord, ...localList];
  saveLocalWords(updated);
  return fallbackWord;
}

export async function deleteWord(id: string): Promise<boolean> {
  const localList = getLocalWords();
  const updated = localList.filter((w) => w.id !== id);
  saveLocalWords(updated);

  try {
    await fetch(`/api/words/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.info('Backend silme işlemi yapılamadı:', err);
  }

  return true;
}

export function downloadWordsJson(words: Word[]) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(words, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'words.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
