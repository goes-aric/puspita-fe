<template>
  <nav class="px-1 pt-6 overflow-y-auto font-medium text-base sm:px-3 xl:px-5 lg:text-sm pb-10 lg:pt-10 lg:pb-14 h-screen">
    <ul>
      <li v-for="(section, index) in menu" :key="index" :class="{ 'mt-6' : section.header }">
        <h5 v-if="section.header !== null" class="nav-header">{{ section.header }}</h5>
        <span v-if="section.header === null" @click="toggleSidebar">
          <router-link :to="{ name: section.items[0].url }" class="nav-item">
            <span class="relative">{{ section.items[0].name }}</span>
          </router-link>
        </span>
        <ul v-if="section.header !== null">
          <li v-for="item in section.items" :key="item.name" @click="toggleSidebar">
            <router-link :to="{ name: item.url }" class="nav-item">
              <span class="relative">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'SidebarNav',
  data(){
    return {
      menu: [
        {
          header: null,
          items: [
            {
              name: 'Dashboard',
              isOpen: true,
              url: 'dashboard'
            }
          ]
        },
        {
          header: null,
          items: [
            {
              name: 'User',
              isOpen: true,
              url: 'user'
            }
          ]
        },        
        {
          header: 'Pendapatan',
          items: [
            {
              name: 'Jenis Kendaraan',
              isOpen: false,
              url: 'kendaraan'            
            },
            {
              name: 'Aplusan Pendapatan',
              isOpen: false,
              url: 'aplusan'            
            },
            {
              name: 'Laporan Rekapitulasi',
              isOpen: false,
              url: 'rekapitulasi'            
            },                                                                   
          ]
        },
        {
          header: 'Pengeluaran',
          items: [
            {
              name: 'Akun Pengeluaran',
              isOpen: false,
              url: 'akun'
            },
            {
              name: 'Laporan Pengeluaran',
              isOpen: false,
              url: 'pengeluaran'
            },            
          ]
        },                          
      ]
    }
  },
  methods: {
    toggleSidebar(){
      this.$store.dispatch('toggleSidebar', !this.isHidden)
    }     
  }
}
</script>