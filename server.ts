import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateReportContent } from './src/server/reportService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const result = await generateReportContent(req.body);
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

app.post('/api/lucky', async (req, res) => {
  try {
    const result = await generateReportContent({ ...req.body, isLucky: true });
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// Serve static build in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
