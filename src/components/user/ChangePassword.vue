<template>
  <div>
    <div class="breadcrumb justify-between">
      <div class="w-full flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">Ganti Password</h1>
        <ol class="md:flex hidden text-sm gap-2">
          <li>Dashboard | </li>
          <li>Pengaturan | </li>
          <li>User | </li>
          <li>Ganti Password</li>
        </ol>
      </div>
    </div>
    <!-- FORM SECTION -->
    <div class="p-6 rounded-sm bg-white shadow-lg transition duration-150 ease-in">
      <Form @submit="update()">
        <div class="md:flex gap-6">
          <div class="w-full mb-4">
            <label for="password_lama" class="label-control">Password Lama <span class="text-red-600">*</span></label>
            <div class="relative flex justify-between items-center">
              <Field id="password_lama" name="password_lama" label="Password lama" :type="inputCurrentPassword" v-model="currentPassword" maxlength="255" rules="required|min:6" class="form-control" autofocus /> 
              <span class="h-full absolute cursor-pointer right-0">
                <IconHide v-if="!visibilityCurrentPassword" @click="togglePassword()" class="m-3" />
                <IconView v-if="visibilityCurrentPassword" @click="togglePassword()" class="m-3" />
              </span>                      
            </div>
            <ErrorMessage name="password_lama" class="capitalize text-sm text-red-600" />
            <div v-if="error.password_lama" class="capitalize text-sm text-red-600"><span>{{ error.password_lama[0] }}</span></div>
          </div>
        </div>
        <div class="md:flex gap-6">
          <div class="md:w-1/2 mb-4">
            <label for="password_baru" class="label-control">Password Baru <span class="text-red-600">*</span></label>
            <div class="relative flex justify-between items-center">
              <Field id="password_baru" name="password_baru" label="Password baru" :type="inputNewPassword" v-model="newPassword" maxlength="255" rules="required|min:8" class="form-control" />
              <span class="h-full absolute cursor-pointer right-0">
                <IconHide v-if="!visibilityNewPassword" @click="toggleNewPassword()" class="m-3" />
                <IconView v-if="visibilityNewPassword" @click="toggleNewPassword()" class="m-3" />
              </span>                      
            </div>
            <ErrorMessage name="password_baru" class="capitalize text-sm text-red-600" />
            <div v-if="error.password_baru" class="capitalize text-sm text-red-600"><span>{{ error.password_baru[0] }}</span></div>
          </div>
          <div class="md:w-1/2 mb-4">
            <label for="konfirmasi_password_baru" class="label-control">Konfirmasi Password Baru <span class="text-red-600">*</span></label>
            <div class="relative flex justify-between items-center">
              <Field id="konfirmasi_password_baru" name="konfirmasi_password_baru" label="Konfirmasi password baru" :type="inputNewPasswordConfirmation" v-model="newPasswordConfirmation" maxlength="255" rules="required|min:8|confirmed:@password_baru" class="form-control" />
              <span class="h-full absolute cursor-pointer right-0">
                <IconHide v-if="!visibilityNewPasswordConfirmation" @click="togglePasswordConfirmation()" class="m-3" />
                <IconView v-if="visibilityNewPasswordConfirmation" @click="togglePasswordConfirmation()" class="m-3" />
              </span>                      
            </div>
            <ErrorMessage name="konfirmasi_password_baru" class="capitalize text-sm text-red-600" />
            <div v-if="error.konfirmasi_password_baru" class="capitalize text-sm text-red-600"><span>{{ error.konfirmasi_password_baru[0] }}</span></div>
          </div>
        </div>
        <div class="flex gap-4 mt-4 mb-2">
          <button :disabled="isLoading" type="submit" class="btn btn--primary flex" alt="Simpan" title="Simpan">
            <span v-if="isLoading" class="mx-5">
              Memuat...
            </span>
            <span v-else class="flex">
              <IconSave />
              <span class="ml-2">Simpan</span>
            </span>
          </button>
          <button :disabled="isLoading" type="button" @click="goBack()" class="btn btn--secondary flex" alt="Back" title="Back">
            <IconReturn />
            <span class="ml-2">Kembali</span>           
          </button>
        </div>
      </Form>    
    </div>
  </div>
</template>

<script>
import { Field, Form, ErrorMessage } from "vee-validate"
import { createToastInterface } from 'vue-toastification'
import userServices from '@/services/user/userServices'
import IconSave from '../icons/IconSave.vue'
import IconReturn from '../icons/IconReturn.vue'
import IconView from '../icons/IconView.vue'
import IconHide from '../icons/IconHide.vue'

export default {
  name: 'ChangePasswordPage',
  components: {
    Field,
    Form,
    ErrorMessage,    
    IconSave,
    IconReturn,
    IconView,
    IconHide
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

    return {
      toast
    }
  },  
  data(){
    return {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
      visibilityCurrentPassword: false,
      inputCurrentPassword: 'password',
      visibilityNewPassword: false,
      inputNewPassword: 'password', 
      visibilityNewPasswordConfirmation: false,
      inputNewPasswordConfirmation: 'password',                  
      record: [],
      error: [],
      isLoading: false,      
    }
  },
  methods: {
    async update(){
      try {
        this.isLoading = true

        const payload = {
          password_lama: this.currentPassword,
          password_baru: this.newPassword,
          konfirmasi_password_baru: this.newPasswordConfirmation
        }
        const response = await userServices.updatePassword(payload)
        if (response.data.status === 'success') {
          /* EMPTY ERRORS VARIABLE */
          this.error = []
          
          /* SUCCESS MESSAGES */
          this.toast.success(response.data.message)

          /* RETURN TO LIST */
          this.$store.dispatch('toggleCurrActive', 'dashboard')
          this.$router.push({ name: 'dashboard' })
        } else {
          /* SET LOADING STATE IS FALSE */
          this.isLoading = false

          /* EMPTY ERRORS VARIABLE */
          this.error = []

          /* STORE RESPONSE MESSAGE TO A VARIABLE */
          let responseReturn = response.data.message

          /* IF RESPONSE HAS OBJECT, STORE RESPONSE TO ERRORS VARIABLE */
          if (responseReturn.current_password || responseReturn.password || responseReturn.password_confirmation) {
              this.error = response.data.message

          /* ELSE, THROW ERROR MESSAGES */
          } else {
            this.toast.error(response.data.message)
          }          
        }
      } catch (error) {
        /* SET LOADING STATE IS FALSE */
        this.isLoading = false

        /* THROW ERROR MESSAGES */
        this.toast.error(error.message)
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.back() : this.$router.push('/dashboard')
    },
    togglePassword(){
      this.visibilityCurrentPassword = !this.visibilityCurrentPassword
      this.inputCurrentPassword = this.visibilityCurrentPassword == false ? 'password' : 'text'
    },
    toggleNewPassword(){
      this.visibilityNewPassword = !this.visibilityNewPassword
      this.inputNewPassword = this.visibilityNewPassword == false ? 'password' : 'text'
    },
    togglePasswordConfirmation(){
      this.visibilityNewPasswordConfirmation = !this.visibilityNewPasswordConfirmation
      this.inputNewPasswordConfirmation = this.visibilityNewPasswordConfirmation == false ? 'password' : 'text'
    }                 
  }
}
</script>