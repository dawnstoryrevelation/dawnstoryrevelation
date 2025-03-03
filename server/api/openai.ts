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
      
      // Optional: Save chat history to Firestore
      saveChatToFirestore(messages);

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
  async function saveChatToFirestore(messages: Message[]) {
    // This method could directly be connected to your chat store or directly 
    // from where you're sending/receiving messages.
    // Implement the logic here to push the chat history to Firestore.
    // Example: store the messages in the Firebase Firestore using Firebase SDK
    // This would usually require a userId and chatId to correctly store the data.
  }

  return {
    sendChatMessage,
    saveChatToFirestore,
    isLoading,
    error
  };
}