import Constants from 'expo-constants';

// System prompt to guide the model responses
const SUSTAINABILITY_SYSTEM_PROMPT = `
You are EcoNexus, an environmentally-focused AI assistant specializing in sustainability.
Your purpose is to help users understand and implement sustainable practices in their daily lives.

You MUST:
- Focus ONLY on environmentally sustainable topics and practices
- Provide practical, actionable advice on reducing environmental impact
- Be scientifically accurate and cite sources when appropriate
- Be concise and direct in your responses
- Use positive, encouraging language to motivate sustainable actions
- Relate your answers to the UN Sustainable Development Goals when relevant

You MUST NOT:
- Discuss non-environmental topics or give advice unrelated to sustainability
- Provide misleading or scientifically inaccurate information
- Engage in political debates or controversial discussions
- Recommend practices that may be harmful to the environment
- Give vague or generic answers that don't provide real value

Topics you can discuss include:
- Renewable energy and energy conservation
- Sustainable transportation
- Waste reduction, recycling, and composting
- Sustainable food systems and diet
- Water conservation
- Eco-friendly product choices
- Carbon footprint reduction
- Sustainable gardening and agriculture
- Environmental policy and advocacy
- Climate change mitigation and adaptation

Stick strictly to these guidelines in all responses.
`;

// Get the API key from environment variables
const getApiKey = () => {
  // Try all possible sources for the API key
  const apiKey =
    Constants.expoConfig?.extra?.geminiApiKey ||
    process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  return apiKey;
};

// Fallback responses for when API is unavailable
const FALLBACK_RESPONSES = [
  'I can suggest some ways to reduce your carbon footprint: use public transportation, reduce meat consumption, minimize single-use plastics, and conserve energy at home by unplugging devices when not in use.',
  'Water conservation is important for sustainability. Try installing low-flow fixtures, fixing leaks promptly, collecting rainwater for plants, and taking shorter showers.',
  'For sustainable eating, consider choosing locally grown foods, reducing meat consumption, growing your own herbs, and composting food scraps to minimize waste.',
  'Renewable energy options include solar panels, wind turbines, geothermal systems, and hydroelectric power. Many utility companies also offer green energy programs you can opt into.',
  "To reduce waste, follow the principle of 'Refuse, Reduce, Reuse, Recycle, Rot' in that order. Refuse what you don't need, reduce consumption, reuse items, recycle properly, and compost organic waste.",
];

/**
 * Get a random fallback response when the API is unavailable
 * @returns {string} A fallback response about sustainability
 */
function getFallbackResponse(): string {
  const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
  return FALLBACK_RESPONSES[randomIndex];
}

/**
 * Generate a response from Gemini API for sustainability queries
 * @param {string} query - The user's query related to sustainability
 * @returns {Promise<string>} The generated response
 */
export async function generateSustainabilityResponse(
  query: string
): Promise<string> {
  try {
    const apiKey = getApiKey();

    if (!apiKey) {
      console.warn('Gemini API key not found, using fallback response');
      return `I'm currently operating in offline mode. ${getFallbackResponse()}`;
    }

    console.log('Attempting to connect to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: SUSTAINABILITY_SYSTEM_PROMPT }, { text: query }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 400,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);

      // Check if it's an authentication or key issue
      if (
        response.status === 401 ||
        response.status === 403 ||
        errorText.includes('key')
      ) {
        console.error('API key issue detected');
        return (
          "I'm having trouble accessing my knowledge base due to authentication issues. Here's some general advice instead: " +
          getFallbackResponse()
        );
      }

      return (
        "I encountered an error processing your request. Here's what I know about sustainability: " +
        getFallbackResponse()
      );
    }

    const data = await response.json();

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error(
        'Unexpected Gemini API response format:',
        JSON.stringify(data, null, 2)
      );
      return (
        "I couldn't generate a specific response to your question. " +
        getFallbackResponse()
      );
    }
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    return "I'm having connectivity issues right now. " + getFallbackResponse();
  }
}

/**
 * List of predefined sustainability topics for suggested questions
 */
export const SUSTAINABILITY_TOPICS = [
  'How can I reduce my carbon footprint?',
  'What are the best ways to conserve water at home?',
  'How do I start composting in an apartment?',
  'What renewable energy options are available for homeowners?',
  'How can I reduce single-use plastics in my daily life?',
  'What are the most eco-friendly transportation options?',
  'How can I make my diet more sustainable?',
  'What are simple energy conservation tips for my home?',
  'How do I properly recycle electronics?',
  'What sustainable practices can I implement in my garden?',
];

/**
 * Get random suggested questions about sustainability
 * @param {number} count - Number of questions to return
 * @returns {string[]} Array of suggested questions
 */
export function getRandomSustainabilityQuestions(count: number = 3): string[] {
  const shuffled = [...SUSTAINABILITY_TOPICS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
