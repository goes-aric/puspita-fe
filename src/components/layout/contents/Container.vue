<template>
  <div>
    <button @click="toggleSidebar" type="button" class="fixed z-50 bottom-4 right-4 w-14 h-14 rounded-full bg-pink-600 text-white block lg:hidden">
      <span class="sr-only">Open site navigation</span>
      <svg width="24" height="24" fill="none" class="absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform" :class="{ 'opacity-0': !isHidden }">
        <path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <svg width="24" height="24" fill="none" class="absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform scale-80" :class="{ 'opacity-0': isHidden }">
        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
    <div class="w-full max-w-full mx-auto">
      <div class="lg:flex">
        <slot />
      </div>
    </div>
  </div>  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageContainer',
  computed: {
    ...mapGetters({
      isHidden: 'isHidden'
    })
  },
  methods: {
    toggleSidebar(){
      this.$store.dispatch('toggleSidebar', !this.isHidden)
    }    
  }
}
</script>