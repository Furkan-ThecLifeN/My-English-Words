import { list, put } from '@vercel/blob';
import words from '../public/words.json';

type WordRecord = {
  id: string;
  word: string;
  translation: string;
  sentence: string;
  createdAt?: number;
};

function validateWords(value: unknown): WordRecord[] | null {
  if (!Array.isArray(value)) return null;

  const ids = new Set<string>();
  const result: WordRecord[] = [];
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
    const record = item as Record<string, unknown>;
    if (
      typeof record.word !== 'string' || !record.word.trim() ||
      typeof record.translation !== 'string' || !record.translation.trim() ||
      typeof record.sentence !== 'string' || !record.sentence.trim()
    ) return null;

    let id = typeof record.id === 'string' || typeof record.id === 'number'
      ? String(record.id).trim()
      : '';
    if (!id || ids.has(id)) id = `${Date.now()}-${index}`;
    while (ids.has(id)) id = `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`;
    ids.add(id);
    result.push({
      id,
      word: record.word.trim(),
      translation: record.translation.trim(),
      sentence: record.sentence.trim(),
      ...(typeof record.createdAt === 'number' ? { createdAt: record.createdAt } : {}),
    });
  }
  return result;
}

async function readStoredWords(): Promise<WordRecord[] | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: 'words.json', limit: 10 });
  const storedBlob = blobs.find((blob) => blob.pathname === 'words.json');
  if (!storedBlob) return null;
  const response = await fetch(storedBlob.url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Blob kelime dosyası okunamadı.');
  return validateWords(await response.json());
}

async function saveWords(wordsToSave: WordRecord[]): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Vercel Blob deposu bağlı değil. BLOB_READ_WRITE_TOKEN ayarlanmalıdır.');
  }
  await put('words.json', JSON.stringify(wordsToSave, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
  });
}

function authorizeWrite(request: any, response: any): boolean {
  const token = process.env.WORDS_WRITE_TOKEN;
  if (!token) {
    response.status(503).json({ error: 'Vercel ortamında WORDS_WRITE_TOKEN ayarlanmalıdır.' });
    return false;
  }
  if (request.headers?.authorization !== `Bearer ${token}`) {
    response.status(401).json({ error: 'Yazma anahtarı geçersiz veya eksik.' });
    return false;
  }
  return true;
}

export default async function handler(request: any, response: any) {
  if (request.method === 'GET') {
    try {
      const storedWords = await readStoredWords();
      return response.status(200).json(storedWords ?? words);
    } catch (error) {
      console.error('Error reading stored words:', error);
      return response.status(500).json({ error: 'Kelime verileri okunamadı.' });
    }
  }

  if (request.method === 'PUT') {
    if (!authorizeWrite(request, response)) return;
    const importedWords = validateWords(request.body);
    if (!importedWords?.length) {
      return response.status(400).json({ error: 'JSON boş olmayan, geçerli bir kelime dizisi içermelidir.' });
    }
    try {
      await saveWords(importedWords);
      return response.status(200).json(importedWords);
    } catch (error) {
      console.error('Error replacing words:', error);
      return response.status(503).json({ error: error instanceof Error ? error.message : 'JSON kaydedilemedi.' });
    }
  }

  if (request.method === 'POST') {
    if (!authorizeWrite(request, response)) return;
    const incoming = request.body as Record<string, unknown>;
    if (
      typeof incoming?.word !== 'string' || !incoming.word.trim() ||
      typeof incoming?.translation !== 'string' || !incoming.translation.trim() ||
      typeof incoming?.sentence !== 'string' || !incoming.sentence.trim()
    ) return response.status(400).json({ error: 'Kelime, anlam ve örnek cümle zorunludur.' });
    const newWord: WordRecord = {
      id: `${Date.now()}`,
      word: incoming.word.trim(),
      translation: incoming.translation.trim(),
      sentence: incoming.sentence.trim(),
    };
    try {
      const currentWords = await readStoredWords() ?? words;
      const validated = validateWords(currentWords);
      await saveWords([newWord, ...(validated ?? [])]);
      return response.status(201).json(newWord);
    } catch (error) {
      console.error('Error adding word:', error);
      return response.status(503).json({ error: error instanceof Error ? error.message : 'Kelime kaydedilemedi.' });
    }
  }

  if (request.method === 'DELETE') {
    if (!authorizeWrite(request, response)) return;
    const id = typeof request.query?.id === 'string' ? request.query.id : '';
    if (!id) return response.status(400).json({ error: 'Silinecek kelime kimliği eksik.' });
    try {
      const currentWords = await readStoredWords() ?? words;
      const updatedWords = validateWords(currentWords)?.filter((item) => item.id !== id) ?? [];
      await saveWords(updatedWords);
      return response.status(200).json({ success: true, count: updatedWords.length });
    } catch (error) {
      console.error('Error deleting word:', error);
      return response.status(503).json({ error: error instanceof Error ? error.message : 'Kelime silinemedi.' });
    }
  }

  response.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return response.status(405).json({ error: 'Method not allowed' });
}