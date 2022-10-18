<template>
  <div class="lg:w-auto flex-shrink-0 flex items-center justify-end space-x-6">
    <div class="block relative">
      <button @click="toggleDropdown" class="ml-2 btn-sm btn--light-primary" v-tooltip="'Open Filters Dialog'">
        <FilterIcon>
          <span class="ml-2 text-sm md:block hidden">Filters</span>
        </FilterIcon>
      </button>
      <transition v-if="this.isVisible" name="slide-fade">
        <div class="absolute text-sm right-0 bg-white border-b-4 border-purple-600 shadow rounded-lg min-w-48 mt-2 py-1 z-20">
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// import FilterIcon from '../icons/Filter2Icon'

export default {
  data() {
    return {
      isVisible: false     
    }
  },
  components: {
    // FilterIcon
  },
  methods: {
    toggleDropdown(){
      this.isVisible = !this.isVisible
    },
    hideDropdown(e){
      if (!this.$el.contains(e.target)) {
        this.isVisible = false
      }
    }
  },
  mounted(){
    document.addEventListener('click', this.hideDropdown)
  },
  beforeDestroy(){
    document.addEventListener('click', this.hideDropdown)
  }
}
</script>