import 'server-only';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export class HuggingFaceAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'HuggingFaceAPIError';
  }
}

export class HuggingFaceAPI {
  private apiKey: string;
  private baseURL = 'https://router.huggingface.co/v1';
  
  constructor() {
    this.apiKey = process.env.HF_TOKEN || '';
    if (!this.apiKey) {
      throw new Error('HF_TOKEN environment variable is required');
    }
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const {
      messages,
      model = process.env.HUGGINGFACE_MODEL || 'deepseek-ai/DeepSeek-V3.1',
      stream = false,
      temperature = 0.7,
      max_tokens = 1000
    } = request;

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        stream,
        temperature,
        max_tokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new HuggingFaceAPIError(
        `HTTP ${response.status}: ${errorText}`,
        response.status
      );
    }

    return await response.json();
  }

  async generateResponse(prompt: string, systemMessage?: string): Promise<string> {
    const messages: ChatMessage[] = [];
    
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }
    
    messages.push({ role: 'user', content: prompt });

    const response = await this.chatCompletion({ messages });
    return response.choices[0]?.message?.content || '';
  }
}

// Singleton instance
export const huggingfaceAPI = new HuggingFaceAPI();