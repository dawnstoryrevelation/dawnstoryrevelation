import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Chat from '../views/Chat.vue';
import Settings from '../views/Settings.vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';

const routes = [
  {
    path: '/',
    redirect: '/register'  // Redirect to the register page if not authenticated
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }  // No authentication required for register page
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }  // No authentication required for login page
  },
  {
    path: '/home',
    name: 'Home',
    components: {
      default: Home,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }  // Authentication required for home page
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    components: {
      default: Chat,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }  // Authentication required for chat page
  },
  {
    path: '/settings',
    name: 'Settings',
    components: {
      default: Settings,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }  // Authentication required for settings page
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard to protect routes that require authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  await authStore.initAuth();  // Wait for authentication state to be initialized
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/register');  // Redirect to register page if not authenticated
  } else {
    next();  // Proceed to the requested route
  }
});

export default router;