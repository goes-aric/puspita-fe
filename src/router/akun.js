import ListAkun from '../components/features/akun/List.vue'

const routes = [
  {
    path: '/bagan-akun',
    name: 'akun',
    component: ListAkun,
    meta: {
      title: 'Bagan Akun',
      requiresAuth: true
    }    
  }
]

export default routes