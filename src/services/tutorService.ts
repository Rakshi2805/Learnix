export interface AskTutorParams {
  topic: string;
  learnerLevel: string;
  learnerGoal: string;
  userQuestion: string;
}

export interface TutorApiResponse {
  answer?: string;
  error?: string;
}

/**
 * Sends the learner's question to the server-side AI tutor.
 *
 * The API key is NOT stored or exposed in the frontend.
 * The frontend only calls /api/tutor.
 */
export async function askAiTutor(
  params: AskTutorParams
): Promise<TutorApiResponse> {
  try {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      return {
        error:
          "Sorry, I couldn't generate an answer right now. Please try again.",
      };
    }

    const data = await response.json();

    if (data.error) {
      return {
        error: data.error,
      };
    }

    return {
      answer: data.answer,
    };
  } catch (error) {
    console.error('AI Tutor Error:', error);

    return {
      error:
        "Sorry, I couldn't connect to the AI tutor right now. Please try again.",
    };
  }
}