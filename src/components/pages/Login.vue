<template>
  <div class="flex w-full h-full">
    <div class="hidden md:w-1/2 xl:w-2/3 h-screen bg-black">
      <!-- <LoginBackground /> -->
    </div>
    <div class="relative bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
          flex items-center justify-center">
      <div class="w-full h-100">
        <div class="text-center">
          <h1 class="text-xl md:text-2xl font-bold leading-tight uppercase">Sistem Pengelolaan Uang Parkir</h1>
          <span class="mt-12">Unit Pasar Umum Beringkit</span>
          <img :src="LogoSource" class="h-16 pt-2 mx-auto">
        </div>
        <Form class="mt-6" @submit="authUser()">
          <div>
            <Field type="text" id="username" name="username" v-model="username" rules="required" label="Username" placeholder="Masukan Username" class="form-control bg-gray-200 focus:bg-white focus:outline-none" autofocus />
            <ErrorMessage name="username" class="capitalize text-sm text-red-600" />
            <div v-if="error.username" class="capitalize text-sm text-red-600"><span>{{ error.username[0] }}</span></div>
          </div>
          <div class="mt-4">
            <Field :type="inputType" id="password" name="password" v-model="password" rules="required" label="Password" placeholder="Masukan Password" class="form-control bg-gray-200 focus:bg-white focus:outline-none" />
            <ErrorMessage name="password" class="capitalize text-sm text-red-600" />
            <div v-if="error.password" class="capitalize text-sm text-red-600"><span>{{ error.password[0] }}</span></div>         
          </div>
          <button :disabled="isLoading" type="submit" class="w-full btn btn--info font-normal mt-6 disabled:opacity-50">
            {{ isLoading ? 'Memproses...' : 'Sign In' }}
          </button>
        </Form>
      </div> 
    </div>
  </div>
</template>

<script>
import { createToastInterface } from 'vue-toastification'
import { Field, Form, ErrorMessage } from "vee-validate"
import authServices from '@/services/user/authServices'
import LoginBackground from '../icons/LoginBackground.vue'
import Logo from '../../assets/images/logo.png'

export default {
  name: 'LoginPage',
  components: {
    Field,
    Form,
    ErrorMessage,
    LoginBackground,
  },  
  setup () { 
    const toastOptions = {
      position: "top-right",
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: false,
      pauseOnHover: true,
      draggable: false,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: true,
      closeButton: "button",
      icon: false,
      rtl: false
    }
    const toast = createToastInterface(toastOptions)

    const schema = {
      username: 'required|length:5',
      password: 'required|length:6',        
    }  

    return {
      toast,
      schema
    }
  },
  data(){
    return{
      username: '',
      password: '',
      visibility: false,
      inputType: 'password',
      error: [],
      isLoading: false,
      LogoSource: Logo,
    }
  },
  methods: {
    async authUser(){
      try {
        /* SET LOADING STATE IS TRUE */
        this.isLoading = true

        const payload = {
          username: this.username,
          password: this.password
        }
        const response = await authServices.login(payload)
        if (response.data.status === 'success') {
          /* CLEAR INPUT FORM */
          this.clearForm()

          /* EMPTY ERRORS VARIABLE */
          this.error = []

          /* GET THE USER PERMISSIONS AND STORE */
          let roles = response.data.data.roles
          let userMenus = []
          let userPermissions = []
          if (roles) {
            roles.forEach(role => {
              role.permissions.forEach(element => {
                const find = userMenus.filter(data => data == element.master_group)
                if (find.length == 0) {
                  userMenus.push(element.master_group)
                }
                userPermissions.push(element.key)
              })              
            })       
          }

          /* STORE DATA TO LOCAL STORAGE */
          localStorage.setItem('accessToken', response.data.access_token)

          this.$store.dispatch('setAuthentication', response.data.access_token)
          this.$store.dispatch('setUser', response.data.data)
          this.$store.dispatch('setUserMenus', userMenus)
          this.$store.dispatch('setUserPermissions', userPermissions)

          /* WELCOME MESSAGE */
          this.toast.success('Selamat datang ' + this.$store.state.user.nama_user)

          /* REDIRECT TO REQUEST PAGE IF AVAILABLE */
          if (this.$route.query.redirect) {
            this.$router.push({ path: this.$route.query.redirect })
          } else {
            /* ELSE REDIRECT TO HOME / DASHBOARD */
            this.$store.dispatch('toggleCurrActive', 'dashboard')
            this.$store.dispatch('togglePrevActive', 'dashboard')
            this.$router.push('/dashboard')
          }
        } else {
          /* SET LOADING STATE IS FALSE */
          this.isLoading = false

          /* EMPTY ERRORS VARIABLE */
          this.error = []

          /* STORE RESPONSE MESSAGE TO A VARIABLE */
          let responseReturn = response.data.message

          /* IF RESPONSE HAS OBJECT USERNAME OR PASSWORD, STORE RESPONSE TO ERRORS VARIABLE */
          if (responseReturn.username || responseReturn.password) {
              this.error = response.data.message

          /* ELSE, THROW ERROR MESSAGES */
          } else {
            this.toast.error(response.data.message)
          }
        }        
      } catch (error) {
          /* SET LOADING STATE IS FALSE */
          this.isLoading = false
          
          /* ELSE, THROW ERROR MESSAGES */
          this.toast.error(error.message)
      }
    },
    clearForm(){
      this.username = '',
      this.password = ''
    },
  }
}
</script>