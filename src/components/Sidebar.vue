<template>
  <div
    class="fixed inset-y-0 left-0 z-10 flex flex-col w-16 bg-cosmic-dark text-white shadow-lg transition-all duration-300"
    :class="{ 'w-64': isExpanded }"
  >
    <div class="flex-shrink-0 h-16"></div>
    <!-- Spacer for header -->

    <div class="flex-1 flex flex-col items-center py-4 overflow-y-auto">
      <button @click="toggleSidebar" class="sidebar-icon mb-6">
        <i
          :class="
            isExpanded ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'
          "
          class="text-xl"
        ></i>
        <span class="sidebar-tooltip">{{
          isExpanded ? 'Collapse' : 'Expand'
        }}</span>
      </button>

      <router-link
        to="/"
        class="sidebar-icon"
        :class="{ 'justify-start px-4 w-full': isExpanded }"
      >
        <i class="ri-home-line text-xl"></i>
        <span v-if="isExpanded" class="ml-4">Home</span>
        <span v-else class="sidebar-tooltip">Home</span>
      </router-link>

      <router-link
        to="/chats"
        class="sidebar-icon"
        :class="{ 'justify-start px-4 w-full': isExpanded }"
      >
        <i class="ri-chat-3-line text-xl"></i>
        <span v-if="isExpanded" class="ml-4">Chats</span>
        <span v-else class="sidebar-tooltip">Chats</span>
      </router-link>

      <router-link
        to="/settings"
        class="sidebar-icon"
        :class="{ 'justify-start px-4 w-full': isExpanded }"
      >
        <i class="ri-settings-3-line text-xl"></i>
        <span v-if="isExpanded" class="ml-4">Settings</span>
        <span v-else class="sidebar-tooltip">Settings</span>
      </router-link>

       <router-link
        to="/ai"
        class="sidebar-icon"
        :class="{ 'justify-start px-4 w-full': isExpanded }"
      >
        <i class="ri-robot-line text-xl"></i>
        <span v-if="isExpanded" class="ml-4">AI</span>
        <span v-else class="sidebar-tooltip">AI</span>
      </router-link>

      <div class="flex-grow"></div>

      <button
        @click="logout"
        class="sidebar-icon"
        :class="{ 'justify-start px-4 w-full': isExpanded }"
      >
        <i class="ri-logout-box-line text-xl"></i>
        <span v-if="isExpanded" class="ml-4">Logout</span>
        <span v-else class="sidebar-tooltip">Logout</span>
      </button>
    </div>
  </div>

  <!-- Main content padding -->
  <div class="w-16 flex-shrink-0"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isExpanded = ref(false);

function toggleSidebar() {
  isExpanded.value = !isExpanded.value;
}

async function logout() {
  const result = await authStore.signOut();
  if (result.success) {
    router.push('/login');
  }
}
</script>
