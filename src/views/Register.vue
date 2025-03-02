<template>
  <div class="register-container max-w-md mx-auto p-6 bg-white dark:bg-cosmic-darker rounded-lg shadow-lg mt-10">
    <h1 class="text-2xl font-orbitron text-center mb-6 text-indigo-600 dark:text-indigo-400">Create Your Account</h1>
    
    <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>
    
    <form @submit.prevent="register" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
        <input 
          id="name" 
          v-model="name" 
          type="text" 
          required 
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-cosmic-dark dark:text-white"
        />
      </div>
      
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input 
          id="email" 
          v-model="email" 
          type="email" 
          required 
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-cosmic-dark dark:text-white"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input 
          id="password" 
          v-model="password" 
          type="password" 
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-cosmic-dark dark:text-white"
        />
      </div>
      
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
        <input 
          id="confirmPassword" 
          v-model="confirmPassword" 
          type="password" 
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-cosmic-dark dark:text-white"
        />
      </div>
      
      <div>
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <span v-if="loading">Creating account...</span>
          <span v-else>Create Account</span>
        </button>
      </div>
    </form>
    
    <div class="mt-4 text-center text-sm">
      <p class="text-gray-600 dark:text-gray-400">
        Already have an account? 
        <router-link to="/login" class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);

const register = async () => {
  // Reset error
  error.value = '';
  
  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }
  
  // Validate password strength
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long';
    return;
  }
  
  try {
    loading.value = true;
    
    // Call the register method from the auth store
    await authStore.register(email.value, password.value, name.value);
    
    // Redirect to home
    router.push('/');
  } catch (e) {
    console.error('Registration error:', e);
    error.value = e.message || 'An error occurred during registration';
  } finally {
    loading.value = false;
  }
};
</script>