/**
 * Standalone Learnix Node Server (Optional / Production fallback)
 * Serves /api/tutor and static frontend files from dist/
 * Uses native Node http module (zero external dependencies).
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5173;

function getOpenAIApiKey() {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    return process.env.OPENAI_API_KEY.trim();
  }
  try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^OPENAI_API_KEY\s*=\s*(.*)$/);
          if (match && match[1]) {
            const val = match[1].trim().replace(/^["']|["']$/g, '');
            if (val) return val;
          }
        }
      }
    }
  } catch {
    // ignore
  }
  return '';
}

async function handleTutorRequest(req, res) {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', async () => {
    try {
      const raw = Buffer.concat(chunks).toString('utf-8');
      const body = JSON.parse(raw);
      const { topic, learnerLevel, learnerGoal, userQuestion } = body;

      if (!userQuestion || !userQuestion.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Question is required.' }));
        return;
      }

      const apiKey = getOpenAIApiKey();
      if (!apiKey || apiKey === 'your_key_here') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.'
        }));
        return;
      }

      const level = learnerLevel || 'Beginner';
      const goal = learnerGoal || 'AI Fundamentals';
      const currentTopic = topic || 'Artificial Intelligence';

      const systemPrompt = `You are Learnix AI Tutor, a personalized artificial intelligence tutor for learning AI.

Learner Profile:
- Level: ${level} (Beginner / Intermediate / Advanced)
- Learning Goal: ${goal}
- Current Roadmap Topic: ${currentTopic}

Pedagogical Guidelines:
1. Explain strictly according to the learner's level (${level}).
2. For Beginners, use plain, accessible language and relatable analogies. Avoid unnecessary mathematical jargon.
3. For Intermediate learners, connect intuition with mathematical/algorithmic concepts.
4. For Advanced learners, provide technical depth, optimization nuances, and tradeoffs.
5. Always provide concrete real-world examples.
6. Clearly structure explanations with short paragraphs and bullet points.
7. Stay strictly focused on the selected topic: "${currentTopic}".
8. Do not pretend to know personal information about the learner.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuestion.trim() },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: "Sorry, I couldn't generate an answer right now. Please try again."
        }));
        return;
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content || '';

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ answer }));
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: "Sorry, I couldn't generate an answer right now. Please try again."
      }));
    }
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // API endpoint
  if (url === '/api/tutor' && req.method === 'POST') {
    handleTutorRequest(req, res);
    return;
  }

  // Static file serving from dist/ if built
  const distDir = path.resolve(__dirname, 'dist');
  let filePath = path.join(distDir, url === '/' ? 'index.html' : url);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.svg': 'image/svg+xml',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[Learnix] Server running on http://localhost:${PORT}`);
  });
}

export default server;
