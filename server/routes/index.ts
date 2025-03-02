import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue'; // Register component
import Chat from '../views/Chat.vue';
import ChatList from '../views/ChatList.vue';
import Settings from '../views/Settings.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/chat/:id', name: 'Chat', component: Chat, meta: { requiresAuth: true } },
  { path: '/chats', name: 'ChatList', component: ChatList, meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  // No need for a route for ai.html since it's a plain HTML file
];

const router = createRouter({
  history: createWebHistory('/ai/'),
  routes,
});

export default router;