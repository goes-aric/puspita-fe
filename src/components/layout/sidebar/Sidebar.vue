<template>
  <div id="sidebar" class="fixed z-40 inset-0 flex-none h-full bg-gray-800 bg-opacity-25 w-full lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-52 xl:w-60 lg:block" :class="{ 'hidden': isHidden }">
    <div id="navWrapper" class="h-full overflow-y-auto lg:h-auto lg:block lg:sticky lg:bg-transparent overflow-hidden lg:top-16 bg-white mr-24 lg:mr-0">
      <div class="hidden lg:block h-12 pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white"></div>
      <div class="flex mt-2 p-4 gap-4">
        <div><img class="block w-10 h-10 rounded-full object-cover" src="../../../assets/images/user-circle.png" alt="User"></div>
        <div>
          <span class="block text-lg text-left capitalize">{{ userData ? userData.nama_user : 'User' }}</span>
          <span class="block text-xs text-left">Email: {{ userData ? userData.email : 'User' }}</span>
        </div>
      </div>
      <SidebarNav />      
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarNav from './SidebarNav.vue'

export default {
  components: {
    SidebarNav
  },
  computed: {
    ...mapGetters({
      isHidden: 'isHidden',
      userData: 'user'
    })
  }
}
</script>