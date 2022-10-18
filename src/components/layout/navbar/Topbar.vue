<template>
  <div class="sticky top-0 z-20 lg:z-50 h-20 md:h-24 w-full max-w-8xl mx-auto bg-orange-500 flex-none flex">
    <div class="w-full flex items-center px-4 md:px-12 gap-2">
      <div class="flex w-1/3 gap-2">
        <img :src="LogoSource" class="h-16">
        <div class="inline-block text-white text-center">
          <h1 class="text-2xl">SIPAR</h1>
          <span class="text-sm">Sistem Pengelolaan Uang Parkir</span>
        </div>
      </div>
      <div class="w-1/3">
        <div class="mx-auto text-center">
          <span class="md:inline-block uppercase"></span>
        </div>
      </div>      
      <div class="w-1/3 justify-end">
        <DropdownUser />      
      </div>
    </div>
  </div>
</template>

<script>
import DropdownUser from './DropdownUser.vue'
import Logo from '../../../assets/images/logo.png'

export default {
  name: 'TopbarMenu',
  components: {
    DropdownUser
  },
  data() {
    return {
      LogoSource: Logo,
      envCompanyName: ''
    }
  },
  mounted() {
    this.envCompanyName = import.meta.env.VITE_APP_TITLE
  },
}
</script>