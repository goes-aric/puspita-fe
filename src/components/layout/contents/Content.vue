<template>
  <div id="content-wrapper" class="min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible overflow-y-scroll max-h-screen h-full fixed bg-gray-100">
    <div class="min-w-0 min-h-screen flex-auto px-4 sm:px-8 xl:px-12 pt-10 pb-24 lg:pb-10">
      <slot />
    </div>
  </div>  
</template>

<script>
export default {
  name: 'PageContent'
}
</script>