<template>
  <div class="modal-mask" :class="modalOrientation" v-show="show">
    <div class="modal-container" :class="addClass" @click.stop>
      <div class="modal-header">
        <div class="flex">
          <div class="flex-1 font-medium">
            <slot name="header"></slot>
          </div>
          <button type="button" class="flex text-gray-400 right-0" @click="toggleClose()">
            <svg class="h-5 w-5 fill-current hover:text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer flex justify-between">
        <div class="flex w-1/2 items-center">
          <slot name="left-footer"></slot>               
        </div>        
        <div class="w-1/2 items-center right-0">
          <slot name="footer"></slot>
          <button type="button" class="btn btn--secondary ml-2" @click="toggleClose()">
            Tutup
          </button>                  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseModal",
  props: ['show', 'addClass', 'modalOrientation'],
  created() {
    document.addEventListener("keyup", this.onClose);
  },
  unmounted() {
    document.removeEventListener("keyup", this.onClose);
  },
  methods: {   
    toggleClose: function () {
        this.$emit('close');
    },
    onClose(event) {
      // Escape key
      if (this.show && event.keyCode === 27) {
        this.toggleClose();
      }
    },
  },
};
</script>