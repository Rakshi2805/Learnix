import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

interface TutorRequestBody {
  topic?: string;
  learnerLevel?: string;
  learnerGoal?: string;
  userQuestion?: string;
}

interface OpenRouterChatCompletion {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

/**
 * Safely extracts OPENROUTER_API_KEY from process.env
 * or the project .env file.
 */
export function getOpenRouterApiKey(): string {
  if (
    process.env.OPENROUTER_API_KEY &&
    process.env.OPENROUTER_API_KEY.trim() !== ''
  ) {
    return process.env.OPENROUTER_API_KEY.trim();
  }

  try {
    const envPath = path.resolve(process.cwd(), '.env');

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');

      for (const line of envContent.split(/\r?\n/)) {
        const trimmed = line.trim();

        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^OPENROUTER_API_KEY\s*=\s*(.*)$/);

          if (match && match[1]) {
            const val = match[1]
              .trim()
              .replace(/^["']|["']$/g, '');

            if (val) {
              return val;
            }
          }
        }
      }
    }
  } catch {
    // Ignore .env read errors.
  }

  return '';
}

/**
 * Server-side handler for POST /api/tutor
 */
export async function handleTutorRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');

    res.end(
      JSON.stringify({
        error: 'Method not allowed',
      })
    );

    return;
  }

  const chunks: Buffer[] = [];

  req.on('data', (chunk) => {
    chunks.push(Buffer.from(chunk));
  });

  req.on('end', async () => {
    try {
      const rawBody = Buffer.concat(chunks).toString('utf-8');

      let body: TutorRequestBody = {};

      try {
        body = JSON.parse(rawBody) as TutorRequestBody;
      } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');

        res.end(
          JSON.stringify({
            error: 'Invalid JSON payload',
          })
        );

        return;
      }

      const {
        topic,
        learnerLevel,
        learnerGoal,
        userQuestion,
      } = body;

      if (!userQuestion || !userQuestion.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');

        res.end(
          JSON.stringify({
            error: 'Question is required.',
          })
        );

        return;
      }

      const apiKey = getOpenRouterApiKey();

      if (
        !apiKey ||
        apiKey === 'your_key_here' ||
        apiKey === 'your_openrouter_api_key_here'
      ) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        res.end(
          JSON.stringify({
            error:
              'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env file.',
          })
        );

        return;
      }

      const level = learnerLevel || 'Beginner';
      const goal = learnerGoal || 'AI Fundamentals';
      const currentTopic =
        topic || 'Artificial Intelligence';

      const systemPrompt = `
You are Learnix AI Tutor, a personalised artificial intelligence tutor for learning AI.

Learner Profile:
- Level: ${level}
- Learning Goal: ${goal}
- Current Roadmap Topic: ${currentTopic}

Teaching Guidelines:

1. Explain the topic according to the learner's level.

2. If the learner is a Beginner:
   - Use simple and clear language.
   - Use real-world analogies.
   - Avoid unnecessary technical jargon.
   - Avoid unnecessary advanced mathematics.

3. If the learner is Intermediate:
   - Explain concepts clearly.
   - Include some technical details.
   - Include practical examples where useful.

4. If the learner is Advanced:
   - Provide deeper technical explanations.
   - Include algorithms, mathematical ideas, optimisation concepts,
     or system trade-offs when relevant.

5. Always provide useful real-world examples.

6. Structure the response using short paragraphs,
   bullet points, or numbered steps when helpful.

7. Stay focused on the current roadmap topic:
   "${currentTopic}"

8. Do not pretend to know personal information about the learner.

9. If the learner asks something unrelated to the current topic,
   politely explain that you are focused on the current learning topic.
`;

      // Call OpenRouter from the server.
      const openRouterResponse = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:5173',
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
                content: userQuestion.trim(),
              },
            ],

            temperature: 0.7,
            max_tokens: 800,
          }),
        }
      );

      // Handle OpenRouter API errors.
      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();

        console.error(
          '[Learnix AI Tutor] OpenRouter API Error:',
          openRouterResponse.status,
          errorText
        );

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        res.end(
          JSON.stringify({
            error:
              "Sorry, I couldn't generate an answer right now. Please try again.",
          })
        );

        return;
      }

      const data =
        (await openRouterResponse.json()) as OpenRouterChatCompletion;

      const generatedAnswer =
        data.choices?.[0]?.message?.content?.trim() || '';

      if (!generatedAnswer) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        res.end(
          JSON.stringify({
            error:
              "Sorry, I couldn't generate an answer right now. Please try again.",
          })
        );

        return;
      }

      // Successful response.
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      res.end(
        JSON.stringify({
          answer: generatedAnswer,
        })
      );
    } catch (err) {
      console.error(
        '[Learnix AI Tutor] Internal error handling question:',
        err
      );

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      res.end(
        JSON.stringify({
          error:
            "Sorry, I couldn't generate an answer right now. Please try again.",
        })
      );
    }
  });
}