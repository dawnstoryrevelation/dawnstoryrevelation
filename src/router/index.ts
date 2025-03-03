const routes = [
  {
    path: '/',
    redirect: '/register' // 🚀 Forces all users to start at Register
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
    path: '/dashboard',
    name: 'Dashboard',
    components: {
      default: Profile, // This should be your dashboard or main UI page
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
    path: '/ai',
    beforeEnter() {
      window.location.href = '/app.html';
    }
  }
];