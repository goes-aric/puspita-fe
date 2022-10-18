import ListUser from '../components/features/user/List.vue'
import CreateUser from '../components/features/user/Create.vue'
import EditUser from '../components/features/user/Edit.vue'
import ShowUser from '../components/features/user/Show.vue'
import UpdatePassword from '../components/features/user/ChangePassword.vue'
import ShowProfile from '../components/features/user/Profile.vue'

const routes = [
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
    path: '/users/create',
    name: 'createUser',
    component: CreateUser,
    meta: {
      title: 'Tambah User',
      requiresAuth: true
    }    
  },
  {
    path: '/users/:id/edit',
    name: 'editUser',
    component: EditUser,
    meta: {
      title: 'Edit User',
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
    path: '/users/profile',
    name: 'profileUser',
    component: ShowProfile,
    meta: {
      title: 'Profil User',
      requiresAuth: true
    }    
  },
  {
    path: '/users/:id',
    name: 'showUser',
    component: ShowUser,
    meta: {
      title: 'User',
      requiresAuth: true
    }    
  }   
]

export default routes