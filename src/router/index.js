import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

import Login from '../components/pages/Login.vue'
import Dashboard from '../components/dashboard/Dashboard.vue'

/* AKUN */
import ListAkun from '../components/akun/List.vue'

/* USER */
import ListUser from '../components/user/List.vue'
import UpdatePassword from '../components/user/ChangePassword.vue'

/* X */
import ListKendaraan from '../components/kendaraan/List.vue'
import ListAplusan from '../components/aplusan/List.vue'
import ListRekapitulasi from '../components/rekapitulasi/List.vue'
import ListPengeluaran from '../components/pengeluaran/List.vue'
import ListArusKas from '../components/arusKas/List.vue'

let routes = [
  {
    path: '/auth/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login',
      guest: true
    }    
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }    
  },
  {
    path: '/akun',
    name: 'akun',
    component: ListAkun,
    meta: {
      title: 'Akun Pengeluaran',
      requiresAuth: true
    }    
  },
  {
    path: '/users',
    name: 'user',
    component: ListUser,
    meta: {
      title: 'Users',
      requiresAuth: true
    }    
  },
  {
    path: '/users/password',
    name: 'updatePasswordUser',
    component: UpdatePassword,
    meta: {
      title: 'Ganti Password',
      requiresAuth: true
    }    
  },
  {
    path: '/kendaraan',
    name: 'kendaraan',
    component: ListKendaraan,
    meta: {
      title: 'Jenis Kendaraan',
      requiresAuth: true
    }    
  },
  {
    path: '/aplusan',
    name: 'aplusan',
    component: ListAplusan,
    meta: {
      title: 'Aplusan Pendapatan Parkir',
      requiresAuth: true
    }    
  },
  {
    path: '/rekapitulasi',
    name: 'rekapitulasi',
    component: ListRekapitulasi,
    meta: {
      title: 'Rekapitulasi Pendapatan',
      requiresAuth: true
    }    
  },
  {
    path: '/pengeluaran',
    name: 'pengeluaran',
    component: ListPengeluaran,
    meta: {
      title: 'Pengeluaran Pendapatan Parkir',
      requiresAuth: true
    }    
  },        
  {
    path: '/arus-kas',
    name: 'arusKas',
    component: ListArusKas,
    meta: {
      title: 'Laporan Arus Kas',
      requiresAuth: true
    }
  },  
  {
    path: "/:catchAll(.*)",
    redirect: { name: 'dashboard' }   
  }   
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const DEFAULT_TITLE = 'Dashboard'
const COMPANY_TTITLE = import.meta.env.VITE_APP_TITLE

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}` + ' - ' + COMPANY_TTITLE || DEFAULT_TITLE + ' - ' + COMPANY_TTITLE

  if (to.matched.some(record => record.meta.requiresAuth)) {
    /* THIS ROUTE REQUIRES AUTH, CHECK IF LOGGED IN */
    /* IF NOT, REDIRECT TO LOGIN PAGE */
    if (store.getters.isUserLoggedIn === false) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next() /* GO TO  WHATEVER I'M GOING */
    }
  } else {
    next() /* DOES NOT REQUIRE AUTH, MAKE SURE  TO ALYWAYS CALL NEXT() */
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}` + ' - ' + COMPANY_TTITLE || DEFAULT_TITLE + ' - ' + COMPANY_TTITLE

  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isUserLoggedIn) {
      next({ name: 'dashboard' }) /* IF USER LOGGED IN, REDIRECT TO DASHBOARD WHEN ACCESS LOGIN PAGE */
      return
    }
    next() /* GO TO  WHATEVER I'M GOING */
  } else {
    next() /* DOES NOT REQUIRE AUTH, MAKE SURE  TO ALYWAYS CALL NEXT() */
  }
})

export default router