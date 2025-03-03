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
    redirect: '/register' // Redirect users to register if they aren't authenticated
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    components: {
      default: Home,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    components: {
      default: Chat,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    components: {
      default: Settings,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  await authStore.initAuth();
  
  // Protect routes requiring authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/register'); // Redirect to register if not authenticated
  } else {
    next(); // Proceed to the requested route
  }
});

export default router;