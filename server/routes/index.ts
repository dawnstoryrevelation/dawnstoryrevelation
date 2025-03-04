import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue'; // Register component
import Chat from '../views/Chat.vue';
import ChatList from '../views/ChatList.vue';
import Settings from '../views/Settings.vue';
import Profile from '../views/Profile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
    redirect: '/register', // Redirect to register if not authenticated
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }, // No authentication required for login page
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }, // No authentication required for register page
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true }, // Requires authentication for chat page
  },
  {
    path: '/chats',
    name: 'ChatList',
    component: ChatList,
    meta: { requiresAuth: true }, // Requires authentication for chat list page
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }, // Requires authentication for settings page
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }, // Requires authentication for profile page
  },
];

const router = createRouter({
  history: createWebHistory(), // Adjusted for correct route history
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Assuming you're using Pinia for store
  authStore.initAuth().then(() => {
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      // Redirect to login if the page requires authentication and user is not authenticated
      next('/login');
    } else {
      next(); // Allow navigation
    }
  });
});

export default router;