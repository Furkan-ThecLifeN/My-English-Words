import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'public', 'words.json');

const INITIAL_WORDS = [
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

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_WORDS, null, 2), 'utf-8');
  }
}

async function startServer() {
  ensureDataFile();

  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // API Endpoints for words
  app.get('/api/words', (_req, res) => {
    try {
      ensureDataFile();
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const words = JSON.parse(content);
      res.json(words);
    } catch (error) {
      console.error('Error reading words.json:', error);
      res.status(500).json({ error: 'Kelime verileri okunamadı.' });
    }
  });

  app.post('/api/words', (req, res) => {
    try {
      const { word, translation, sentence } = req.body;
      if (!word || !translation || !sentence) {
        return res.status(400).json({ error: 'Tüm alanlar (kelime, anlam, örnek cümle) zorunludur.' });
      }

      const trimmedWord = String(word).trim();
      const trimmedTranslation = String(translation).trim();
      const trimmedSentence = String(sentence).trim();

      if (!trimmedWord || !trimmedTranslation || !trimmedSentence) {
        return res.status(400).json({ error: 'Alanlar boş bırakılamaz.' });
      }

      ensureDataFile();
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const words = JSON.parse(content);

      const newEntry = {
        id: Date.now().toString(),
        word: trimmedWord,
        translation: trimmedTranslation,
        sentence: trimmedSentence
      };

      // Add to beginning of list so the newest word appears first
      words.unshift(newEntry);
      fs.writeFileSync(DATA_FILE, JSON.stringify(words, null, 2), 'utf-8');

      res.status(201).json(newEntry);
    } catch (error) {
      console.error('Error writing words.json:', error);
      res.status(500).json({ error: 'Yeni kelime kaydedilemedi.' });
    }
  });

  app.put('/api/words', (req, res) => {
    try {
      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'JSON boş olmayan bir kelime dizisi içermelidir.' });
      }
      const ids = new Set<string>();
      const words = req.body.map((item: any, index: number) => {
        if (
          !item || typeof item !== 'object' ||
          typeof item.word !== 'string' || !item.word.trim() ||
          typeof item.translation !== 'string' || !item.translation.trim() ||
          typeof item.sentence !== 'string' || !item.sentence.trim()
        ) throw new Error(`${index + 1}. kelime kaydı geçersiz.`);

        let id = typeof item.id === 'string' || typeof item.id === 'number' ? String(item.id).trim() : '';
        if (!id || ids.has(id)) id = `${Date.now()}-${index}`;
        while (ids.has(id)) id = `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`;
        ids.add(id);
        return {
          id,
          word: item.word.trim(),
          translation: item.translation.trim(),
          sentence: item.sentence.trim(),
          ...(typeof item.createdAt === 'number' ? { createdAt: item.createdAt } : {}),
        };
      });
      fs.writeFileSync(DATA_FILE, JSON.stringify(words, null, 2), 'utf-8');
      return res.json(words);
    } catch (error) {
      return res.status(400).json({ error: error instanceof Error ? error.message : 'JSON kaydedilemedi.' });
    }
  });

  app.delete('/api/words', (req, res) => {
    const id = typeof req.query.id === 'string' ? req.query.id : '';
    if (!id) return res.status(400).json({ error: 'Silinecek kelime kimliği eksik.' });
    try {
      ensureDataFile();
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const words = JSON.parse(content);
      const filtered = words.filter((word: { id: string }) => word.id !== id);
      fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
      return res.json({ success: true, count: filtered.length });
    } catch (error) {
      console.error('Error deleting word:', error);
      return res.status(500).json({ error: 'Kelime silinemedi.' });
    }
  });

  app.delete('/api/words/:id', (req, res) => {
    try {
      const { id } = req.params;
      ensureDataFile();
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const words = JSON.parse(content);
      const filtered = words.filter((w: { id: string }) => w.id !== id);
      fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
      res.json({ success: true, count: filtered.length });
    } catch (error) {
      console.error('Error deleting word:', error);
      res.status(500).json({ error: 'Kelime silinemedi.' });
    }
  });

  // Vite middleware in dev or static files in production
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
