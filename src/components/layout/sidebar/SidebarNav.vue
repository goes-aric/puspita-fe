<template>
  <nav class="px-1 pt-6 overflow-y-auto font-medium text-base sm:px-3 xl:px-5 lg:text-sm pb-10 lg:pt-10 lg:pb-14 h-screen">
    <ul>
      <li class="mt-6">
        <span @click="toggleSidebar">
          <router-link :to="{ name: 'dashboard' }" class="nav-item">
              <span class="relative">Dashboard</span>
            </router-link>
        </span>
        <span v-if="userData.jabatan == 'Admin'" @click="toggleSidebar">
          <router-link :to="{ name: 'user' }" class="nav-item">
              <span class="relative">User</span>
            </router-link>
        </span>
        <h5 v-if="userData.jabatan == 'Admin' || userData.jabatan == 'Kepala Pasar'" class="nav-header mt-5">Pendapatan</h5>     
        <ul v-if="userData.jabatan == 'Admin' || userData.jabatan == 'Kepala Pasar'">
          <li v-if="userData.jabatan == 'Admin'" @click="toggleSidebar">
            <router-link :to="{ name: 'kendaraan' }" class="nav-item">
              <span class="relative">Jenis Kendaraan</span>
            </router-link>
          </li>
          <li @click="toggleSidebar">
            <router-link :to="{ name: 'aplusan' }" class="nav-item">
              <span class="relative">Aplusan Pendapatan</span>
            </router-link>
          </li>
          <li @click="toggleSidebar">
            <router-link :to="{ name: 'rekapitulasi' }" class="nav-item">
              <span class="relative">Laporan Rekapitulasi</span>
            </router-link>
          </li>
        </ul>
        <h5 class="nav-header mt-5">Pengeluaran</h5>     
        <ul>
          <li v-if="userData.jabatan == 'Admin'" @click="toggleSidebar">
            <router-link :to="{ name: 'akun' }" class="nav-item">
              <span class="relative">Akun Pengeluaran</span>
            </router-link>
          </li>
          <li @click="toggleSidebar">
            <router-link :to="{ name: 'pengeluaran' }" class="nav-item">
              <span class="relative">Laporan Pengeluaran</span>
            </router-link>
          </li>
        </ul>        
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarNav',
  methods: {
    toggleSidebar(){
      this.$store.dispatch('toggleSidebar', !this.isHidden)
    }     
  },
  computed: {
    ...mapGetters({
      userData: 'user'
    })
  },  
}
</script>