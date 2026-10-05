import { Word } from '../types';

const WRITE_TOKEN_KEY = 'my_english_words_write_token';

function getWriteHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (import.meta.env.DEV) return headers;

  let token = sessionStorage.getItem(WRITE_TOKEN_KEY);
  if (!token) {
    token = window.prompt('Kelime listesini değiştirmek için WORDS_WRITE_TOKEN anahtarını girin:')?.trim() ?? '';
    if (!token) throw new Error('İşlem iptal edildi.');
    sessionStorage.setItem(WRITE_TOKEN_KEY, token);
  }
  headers.Authorization = `Bearer ${token}`;
  return headers;
}

function clearWriteTokenAfterUnauthorized(response: Response) {
  if (response.status === 401) sessionStorage.removeItem(WRITE_TOKEN_KEY);
}

export async function fetchWords(): Promise<Word[]> {
  try {
    const response = await fetch('/api/words', { cache: 'no-store' });
    if (!response.ok) throw new Error('Kelime API isteği başarısız oldu.');
    return await response.json() as Word[];
  } catch (err) {
    console.warn('API kullanılamadı, public/words.json okunuyor:', err);
    const response = await fetch('/words.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Kelime dosyası yüklenemedi.');
    return await response.json() as Word[];
  }
}

export async function addWord(payload: { word: string; translation: string; sentence: string }): Promise<Word> {
  const response = await fetch('/api/words', {
    method: 'POST',
    headers: getWriteHeaders(),
    body: JSON.stringify(payload),
  });
  clearWriteTokenAfterUnauthorized(response);
  if (!response.ok) throw new Error(await getApiError(response));
  return await response.json() as Word;
}

export async function deleteWord(id: string): Promise<boolean> {
  const response = await fetch(`/api/words?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getWriteHeaders(),
  });
  clearWriteTokenAfterUnauthorized(response);
  if (!response.ok) throw new Error(await getApiError(response));
  return true;
}

export async function replaceWords(words: Word[]): Promise<Word[]> {
  const response = await fetch('/api/words', {
    method: 'PUT',
    headers: getWriteHeaders(),
    body: JSON.stringify(words),
  });
  clearWriteTokenAfterUnauthorized(response);
  if (!response.ok) throw new Error(await getApiError(response));
  return await response.json() as Word[];
}

async function getApiError(response: Response): Promise<string> {
  try {
    const body = await response.json() as { error?: string };
    if (body.error) return body.error;
  } catch {
    // Use the generic message if the response is not JSON.
  }
  return 'Kelime verileri kaydedilemedi.';
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

export function importWordsJson(content: string): Word[] {
  const parsed: unknown = JSON.parse(content);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('JSON dosyası boş olmayan bir kelime dizisi içermelidir.');
  }

  const seenIds = new Set<string>();
  const importedWords = parsed.map((item, index): Word => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error(`${index + 1}. kelime kaydı geçersiz.`);
    }

    const record = item as Record<string, unknown>;
    if (
      typeof record.word !== 'string' || !record.word.trim() ||
      typeof record.translation !== 'string' || !record.translation.trim() ||
      typeof record.sentence !== 'string' || !record.sentence.trim()
    ) {
      throw new Error(`${index + 1}. kayıtta kelime, anlam ve örnek cümle alanları zorunludur.`);
    }

    let id = typeof record.id === 'string' || typeof record.id === 'number'
      ? String(record.id).trim()
      : '';
    if (!id || seenIds.has(id)) id = `${Date.now()}-${index}`;
    while (seenIds.has(id)) id = `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`;
    seenIds.add(id);

    return {
      id,
      word: record.word.trim(),
      translation: record.translation.trim(),
      sentence: record.sentence.trim(),
      ...(typeof record.createdAt === 'number' ? { createdAt: record.createdAt } : {}),
    };
  });

  return importedWords;
}