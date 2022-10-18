<template>
  <div class="lg:w-auto flex-shrink-0 flex items-center justify-end space-x-6">
    <div class="block relative">
      <button @click="toggleDropdown()" class="flex items-center focus:outline-none gap-2">
        <span class="text-sm text-right uppercase text-white p-3 border border-white rounded-sm">{{ userData ? userData.jabatan : 'Jabatan' }}</span>
      </button>
      <div v-if="this.isVisible">
        <ul class="absolute text-sm right-0 bg-white border border-gray-200 overflow-hidden rounded-sm w-72 mt-2 py-1 z-50 lg:z-40">
          <li class="mb-1 border-b border-gray-200">
            <div class="flex py-4 px-4 gap-1">
              <div class="w-1/4">
                <svg class="h-14 w-14 fill-current" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5.9C13.16 5.9 14.1 6.84 14.1 8C14.1 9.16 13.16 10.1 12 10.1C10.84 10.1 9.9 9.16 9.9 8C9.9 6.84 10.84 5.9 12 5.9ZM12 14.9C14.97 14.9 18.1 16.36 18.1 17V18.1H5.9V17C5.9 16.36 9.03 14.9 12 14.9ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z"/>
                </svg>                
              </div>
              <div class="w-3/4">
                <span class="block mb-2 text-gray-800 font-semibold uppercase">{{ userData ? userData.nama_user : 'User' }}</span>
              </div>
            </div>           
          </li>
          <li>
            <a @click="logoutUser()" class="flex items-center px-6 py-3 hover:bg-gray-50 hover:text-gray-700 cursor-pointer">
              <svg class="h-4 w-4" viewBox="0 0 113.055 122.88" enable-background="new 0 0 113.055 122.88" xml:space="preserve">
                <g><path d="M53.114,2.457C53.114,1.1,54.643,0,56.527,0s3.413,1.1,3.413,2.457v44.377c0,1.357-1.528,2.457-3.413,2.457 s-3.413-1.1-3.413-2.457V2.457L53.114,2.457z M73.615,19.661c-1.768-0.648-2.675-2.605-2.026-4.373 c0.647-1.767,2.604-2.674,4.372-2.026c10.962,4.015,20.339,11.339,26.924,20.766c6.409,9.174,10.17,20.32,10.17,32.325 c0,15.606-6.329,29.738-16.559,39.969c-10.23,10.229-24.362,16.559-39.969,16.559s-29.739-6.329-39.969-16.559 C6.329,96.091,0,81.959,0,66.353c0-12.005,3.76-23.151,10.169-32.325c6.585-9.427,15.962-16.751,26.924-20.766 c1.767-0.647,3.725,0.26,4.372,2.026c0.648,1.767-0.259,3.725-2.026,4.373c-9.659,3.538-17.913,9.978-23.698,18.259 c-5.619,8.044-8.916,17.846-8.916,28.433c0,13.723,5.564,26.148,14.559,35.143c8.995,8.995,21.42,14.56,35.143,14.56 s26.148-5.564,35.143-14.56c8.995-8.994,14.559-21.42,14.559-35.143c0-10.587-3.297-20.389-8.916-28.433 C91.527,29.638,83.274,23.198,73.615,19.661L73.615,19.661z"/></g>
              </svg>              
              <span class="ml-2">Keluar</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import authServices from '@/services/user/authServices'
import { createToastInterface } from 'vue-toastification'

export default {
  name: 'DropdownUser',
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
      nama_lengkap: 'required|length:6',
      username: 'required|length:5',
      email: 'email|required',
      password: 'required|length:6',
      password_confirmation: 'required|length:6|confirmed:password',
      status: 'required',            
    }  

    return {
      toast,
      schema
    }
  },  
  data() {
    return {
      isVisible: false,    
    }
  },
  methods: {
    toggleDropdown(){
      this.isVisible = !this.isVisible
    },
    hideDropdown(e){
      if (!this.$el.contains(e.target)) {
        this.isVisible = false
      }
    },
    async logoutUser(){
      try {
        const response = await authServices.logout()
        if (response.data.status === 'success') {
          /* REMOVE DATA TO LOCAL STORAGE */
          localStorage.setItem('accessToken', null)

          this.$store.dispatch('setAuthentication', null)
          this.$store.dispatch('setUser', null)
          
          /* SUCCESS MESSAGE */
          this.toast.success(response.data.message)

          /* REDIRECT TO LOGIN PAGE */
          this.$router.push('/auth/login')          
        } else {
          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error)
        /* THROW ERROR MESSAGES */
        this.toast.error(error.message)        
      }
    }
  },
  mounted(){
    document.addEventListener('click', this.hideDropdown)
  },
  beforeUnmount(){
    document.addEventListener('click', this.hideDropdown)
  },
  computed: {
    ...mapGetters({
      userData: 'user'
    })
  },
}
</script>