import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { list, put } from '@vercel/blob';
import seedWords from '../data/words.json';

type WordRecord = {
  id: string;
  word: string;
  translation: string;
  sentence: string;
  createdAt?: number;
};

const localWordsPath = resolve(process.cwd(), 'data', 'words.local.json');

function usesLocalStore(): boolean {
  return process.env.VERCEL !== '1' && !process.env.BLOB_READ_WRITE_TOKEN;
}

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
  if (usesLocalStore()) {
    try {
      return validateWords(JSON.parse(await readFile(localWordsPath, 'utf8')));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: 'words.json', limit: 10 });
  const storedBlob = blobs.find((blob) => blob.pathname === 'words.json');
  if (!storedBlob) return null;
  const response = await fetch(storedBlob.url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Blob kelime dosyası okunamadı.');
  return validateWords(await response.json());
}

async function hasCompletedSeedMigration(): Promise<boolean> {
  if (usesLocalStore()) {
    try {
      await access(localWordsPath);
      return true;
    } catch {
      return false;
    }
  }
  const { blobs } = await list({ prefix: 'words-migration-v1.json', limit: 10 });
  return blobs.some((blob) => blob.pathname === 'words-migration-v1.json');
}

async function saveWords(wordsToSave: WordRecord[]): Promise<void> {
  if (usesLocalStore()) {
    await writeFile(localWordsPath, JSON.stringify(wordsToSave, null, 2), 'utf8');
    return;
  }
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

async function initializeWords(): Promise<WordRecord[]> {
  const storedWords = await readStoredWords();
  if (await hasCompletedSeedMigration()) return storedWords ?? [];

  const mergedWords = [...(storedWords ?? [])];
  const existingWords = new Set(mergedWords.map((item) => item.word.toLocaleLowerCase('en')));
  for (const seedWord of validateWords(seedWords) ?? []) {
    const normalizedWord = seedWord.word.toLocaleLowerCase('en');
    if (!existingWords.has(normalizedWord)) {
      mergedWords.push(seedWord);
      existingWords.add(normalizedWord);
    }
  }

  await saveWords(mergedWords);
  await put('words-migration-v1.json', '{}', {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
  });
  return mergedWords;
}

export default async function handler(request: any, response: any) {
  if (!usesLocalStore() && !process.env.BLOB_READ_WRITE_TOKEN) {
    return response.status(503).json({ error: 'Vercel Blob bağlı değil. BLOB_READ_WRITE_TOKEN ayarlanmalıdır.' });
  }

  if (request.method === 'GET') {
    try {
      return response.status(200).json(await initializeWords());
    } catch (error) {
      console.error('Error reading stored words:', error);
      return response.status(500).json({ error: 'Kelime verileri okunamadı.' });
    }
  }

  if (request.method === 'PUT') {
    const id = typeof request.params?.id === 'string'
      ? request.params.id
      : typeof request.query?.id === 'string' ? request.query.id : '';
    if (id) {
      const incoming = request.body as Record<string, unknown>;
      if (
        typeof incoming?.word !== 'string' || !incoming.word.trim() ||
        typeof incoming?.translation !== 'string' || !incoming.translation.trim() ||
        typeof incoming?.sentence !== 'string' || !incoming.sentence.trim()
      ) return response.status(400).json({ error: 'Kelime, anlam ve örnek cümle zorunludur.' });

      try {
        const currentWords = await initializeWords();
        const index = currentWords.findIndex((item) => item.id === id);
        if (index < 0) return response.status(404).json({ error: 'Düzenlenecek kelime bulunamadı.' });
        const updatedWord = {
          ...currentWords[index],
          word: incoming.word.trim(),
          translation: incoming.translation.trim(),
          sentence: incoming.sentence.trim(),
        };
        const duplicate = currentWords.some((item, itemIndex) =>
          itemIndex !== index && item.word.toLocaleLowerCase('en') === updatedWord.word.toLocaleLowerCase('en'));
        if (duplicate) return response.status(409).json({ error: 'Bu kelime listede zaten bulunuyor.' });
        currentWords[index] = updatedWord;
        await saveWords(currentWords);
        return response.status(200).json(updatedWord);
      } catch (error) {
        console.error('Error updating word:', error);
        return response.status(503).json({ error: error instanceof Error ? error.message : 'Kelime güncellenemedi.' });
      }
    }

    const importedWords = validateWords(request.body);
    if (!importedWords?.length || new Set(importedWords.map((item) => item.word.toLocaleLowerCase('en'))).size !== importedWords.length) {
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
    const incoming = request.body as Record<string, unknown>;
    if (
      typeof incoming?.word !== 'string' || !incoming.word.trim() ||
      typeof incoming?.translation !== 'string' || !incoming.translation.trim() ||
      typeof incoming?.sentence !== 'string' || !incoming.sentence.trim()
    ) return response.status(400).json({ error: 'Kelime, anlam ve örnek cümle zorunludur.' });
    try {
      const currentWords = await initializeWords();
      const word = incoming.word.trim();
      if (currentWords.some((item) => item.word.toLocaleLowerCase('en') === word.toLocaleLowerCase('en'))) {
        return response.status(409).json({ error: 'Bu kelime listede zaten bulunuyor.' });
      }
      const highestId = currentWords.reduce((highest, item) => {
        if (!/^\d+$/.test(item.id)) return highest;
        const numericId = Number(item.id);
        return Number.isSafeInteger(numericId) ? Math.max(highest, numericId) : highest;
      }, 0);
      const newWord: WordRecord = {
        id: String(highestId + 1),
        word,
        translation: incoming.translation.trim(),
        sentence: incoming.sentence.trim(),
      };
      await saveWords([newWord, ...currentWords]);
      return response.status(201).json(newWord);
    } catch (error) {
      console.error('Error adding word:', error);
      return response.status(503).json({ error: error instanceof Error ? error.message : 'Kelime kaydedilemedi.' });
    }
  }

  if (request.method === 'DELETE') {
    const id = typeof request.params?.id === 'string'
      ? request.params.id
      : typeof request.query?.id === 'string' ? request.query.id : '';
    if (!id) return response.status(400).json({ error: 'Silinecek kelime kimliği eksik.' });
    try {
      const currentWords = await initializeWords();
      if (!currentWords.some((item) => item.id === id)) {
        return response.status(404).json({ error: 'Silinecek kelime bulunamadı.' });
      }
      const updatedWords = currentWords.filter((item) => item.id !== id);
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