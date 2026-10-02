import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.join(__dirname, 'dist');

/* ---------------------------------------
   Read .env file for local development
--------------------------------------- */

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath)) {
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');

    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const equalIndex = trimmed.indexOf('=');

      if (equalIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, equalIndex).trim();
      let value = trimmed.slice(equalIndex + 1).trim();

      value = value.replace(/^["']|["']$/g, '');

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.error('Could not load .env file:', error.message);
  }
}

loadEnvFile();

/* ---------------------------------------
   OpenRouter API key
--------------------------------------- */

function getOpenRouterApiKey() {
  return process.env.OPENROUTER_API_KEY || '';
}

/* ---------------------------------------
   Send JSON response
--------------------------------------- */

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });

  res.end(JSON.stringify(data));
}

/* ---------------------------------------
   Read request body
--------------------------------------- */

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();

      // Prevent extremely large requests
      if (body.length > 1_000_000) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON request body.'));
      }
    });

    req.on('error', reject);
  });
}

/* ---------------------------------------
   AI Tutor
--------------------------------------- */

async function handleTutorRequest(req, res) {
  try {
    const apiKey = getOpenRouterApiKey();

    if (!apiKey) {
      return sendJson(res, 500, {
        error:
          'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY.',
      });
    }

    const body = await readRequestBody(req);

    const {
      topic,
      learnerLevel,
      learnerGoal,
      userQuestion,
    } = body;

    if (!topic || !learnerLevel || !learnerGoal || !userQuestion) {
      return sendJson(res, 400, {
        error:
          'Topic, learner level, learning goal, and question are required.',
      });
    }

    const systemPrompt = `
You are Learnix, a personalised AI tutor for learning AI and machine learning.

Your job is to teach the learner clearly and practically.

Learner information:
- Current level: ${learnerLevel}
- Learning goal: ${learnerGoal}
- Current topic: ${topic}

Teaching rules:
1. Explain concepts according to the learner's current level.
2. Use simple language.
3. Give practical examples when useful.
4. Break difficult concepts into smaller steps.
5. Do not assume advanced knowledge.
6. Encourage the learner to understand the concept rather than simply giving an answer.
7. If the learner asks for code, provide a small understandable example and explain it.
8. Stay focused on AI, machine learning, deep learning, and the learner's current topic.
9. Keep the answer reasonably concise but useful.
10. If the question is unclear, ask a short clarification question.

You are currently teaching:
${topic}
`;

    const userPrompt = `
Learner's question:
${userQuestion}

Please answer this question as a personalised tutor.
`;

    /* ---------------------------------------
       OpenRouter API request
    --------------------------------------- */

    const openRouterResponse = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,

          // Optional OpenRouter attribution headers
          ...(process.env.APP_URL
            ? { 'HTTP-Referer': process.env.APP_URL }
            : {}),

          'X-Title': 'Learnix Personalised AI Tutor',
        },

        body: JSON.stringify({
          model: 'openrouter/free',

          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],

          temperature: 0.7,
          max_tokens: 800,
        }),
      }
    );

    const data = await openRouterResponse.json();

    if (!openRouterResponse.ok) {
      console.error('OpenRouter API Error:', data);

      return sendJson(res, openRouterResponse.status, {
        error:
          data?.error?.message ||
          'The AI tutor could not generate a response right now.',
      });
    }

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      console.error('Unexpected OpenRouter response:', data);

      return sendJson(res, 500, {
        error: 'The AI tutor returned an empty response.',
      });
    }

    return sendJson(res, 200, {
      answer,
    });
  } catch (error) {
    console.error('Tutor request error:', error);

    return sendJson(res, 500, {
      error:
        'Sorry, I could not connect to the AI tutor right now. Please try again.',
    });
  }
}

/* ---------------------------------------
   Serve static files
--------------------------------------- */

function serveStaticFile(req, res) {
  let requestPath = decodeURIComponent(req.url.split('?')[0]);

  // Prevent path traversal
  requestPath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, '');

  let filePath = path.join(DIST_DIR, requestPath);

  // If URL is "/", serve index.html
  if (requestPath === '/' || requestPath === '') {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const extension = path.extname(filePath).toLowerCase();

      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
      };

      const contentType =
        contentTypes[extension] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
      });

      fs.createReadStream(filePath).pipe(res);
      return;
    }

    /* ---------------------------------------
       React Router fallback

       This allows URLs such as:
       /get-started
       /roadmap
       /progress
       /learn/xxx
    --------------------------------------- */

    const indexPath = path.join(DIST_DIR, 'index.html');

    if (fs.existsSync(indexPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });

      fs.createReadStream(indexPath).pipe(res);
      return;
    }

    res.writeHead(404, {
      'Content-Type': 'text/plain',
    });

    res.end('Build files not found. Please run npm run build.');
  } catch (error) {
    console.error('Static file error:', error);

    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });

    res.end('Internal server error.');
  }
}

/* ---------------------------------------
   HTTP Server
--------------------------------------- */

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    });

    res.end();
    return;
  }

  // AI Tutor API
  if (req.method === 'POST' && req.url === '/api/tutor') {
    await handleTutorRequest(req, res);
    return;
  }

  // Only GET requests for frontend files
  if (req.method === 'GET') {
    serveStaticFile(req, res);
    return;
  }

  res.writeHead(405, {
    'Content-Type': 'application/json',
  });

  res.end(
    JSON.stringify({
      error: 'Method not allowed.',
    })
  );
});

/* ---------------------------------------
   Start server
--------------------------------------- */

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Learnix server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log('AI provider: OpenRouter');
  console.log('Model: openrouter/free');
});