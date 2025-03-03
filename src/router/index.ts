import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Chat from '../views/Chat.vue';
import ChatList from '../views/ChatList.vue';
import Settings from '../views/Settings.vue';
import Profile from '../views/Profile.vue';
import AIComponent from '../components/AIComponent.vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
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
    path: '/chats',
    name: 'ChatList',
    components: {
      default: ChatList,
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
  },
  {
    path: '/profile',
    name: 'Profile',
    components: {
      default: Profile,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/ai',
    name: 'AI',
    components: {
      default: AIComponent,
      header: Header,
      sidebar: Sidebar
    },
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  await authStore.initAuth();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;