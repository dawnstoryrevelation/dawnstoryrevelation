<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-cosmic-dark">
    <!-- Chat Header -->
    <header class="bg-cosmic-dark text-white shadow-md px-6 py-3 flex items-center justify-between">
      <h1 class="text-xl font-display font-bold cosmic-glow">
        {{ currentChat?.title || "New Conversation" }}
      </h1>
      <button @click="goBack" class="text-gray-300 hover:text-white">
        <i class="ri-arrow-left-line text-2xl"></i>
      </button>
    </header>

    <!-- Chat Messages -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      <div v-for="message in currentChat?.messages" :key="message.id" class="flex"
        :class="{ 'justify-end': message.role === 'user', 'justify-start': message.role === 'assistant' }">
        <div class="max-w-[75%] p-4 rounded-lg shadow-md"
          :class="message.role === 'user' ? 'bg-cosmic-accent text-white' : 'bg-gray-200 dark:bg-cosmic-light text-gray-800'">
          <p>{{ message.content }}</p>
          <span class="text-xs opacity-75 block mt-1">{{ formatTimestamp(message.timestamp) }}</span>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="p-3 bg-gray-200 dark:bg-cosmic-light text-gray-800 rounded-lg shadow-md">
          <span class="text-sm">DawntasyAI is typing...</span>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="bg-gray-100 dark:bg-cosmic-light p-4 flex items-center">
      <input v-model="newMessage" @keydown.enter="sendMessage" placeholder="Type a message..."
        class="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md focus:outline-none">
      <button @click="sendMessage" class="ml-3 p-2 rounded-full bg-cosmic-accent text-white shadow-md">
        <i class="ri-send-plane-2-line text-xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useChatStore } from '../stores/chat';
import { Timestamp } from 'firebase/firestore';
import { callOpenAI } from '../services/openai';  // Import the OpenAI service for AI responses
import { useAuthStore } from '../stores/auth';  // Import the authentication store

// Stores & Router
const chatStore = useChatStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Chat State
const currentChat = ref(chatStore.currentChat);
const newMessage = ref('');
const isTyping = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

// Scroll to bottom on new messages
watch(currentChat, async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}, { deep: true });

// Fetch chat data
onMounted(async () => {
  const chatId = route.params.id as string;
  await chatStore.fetchChat(chatId);
  currentChat.value = chatStore.currentChat;
});

// Send Message with OpenAI Integration
async function sendMessage() {
  if (!newMessage.value.trim()) return;
  
  const content = newMessage.value.trim();
  newMessage.value = '';

  isTyping.value = true;
  
  // Step 1: Send user message to Firestore
  await chatStore.sendMessage(content);

  // Step 2: Call OpenAI API to get AI response
  const aiResponse = await callOpenAI(content, currentChat.value?.messages || []);
  
  // Step 3: Send AI response to Firestore
  await chatStore.sendMessage(aiResponse);
  
  isTyping.value = false;
}

// Format Timestamp
function formatTimestamp(timestamp: Timestamp | Date) {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Go Back to Chats List
function goBack() {
  router.push('/chats');
}
</script>