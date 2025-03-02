import axios from 'axios';
import { ref } from 'vue';

// OpenAI API configuration
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const baseURL = 'https://api.openai.com/v1';

// Create axios instance for OpenAI API
const openaiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
});

// Define types
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export function useOpenAI() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Send a chat completion request to OpenAI API
   */
  async function sendChatMessage(messages: Message[], model = 'gpt-4o-mini') {
    isLoading.value = true;
    error.value = null;
    
    try {
      const requestData: ChatCompletionRequest = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      };
      
      const response = await openaiClient.post<ChatCompletionResponse>(
        '/chat/completions', 
        requestData
      );
      
      return response.data.choices[0].message;
    } catch (err: any) {
      console.error('OpenAI API error:', err);
      error.value = err.response?.data?.error?.message || 'Error connecting to AI service';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * Save chat history to Firestore
   */
  function saveChatToFirestore(userId: string, chatId: string, messages: Message[]) {
    // This will be implemented in the Chat.vue component
  }

  return {
    sendChatMessage,
    saveChatToFirestore,
    isLoading,
    error
  };
}