<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">Rekapitulasi Pendapatan Parkir</h1>
      </div>
      <div class="flex items-center right-0 gap-2">
        <!-- <button type="button" class="btn btn--primary flex" @click="toggleNew()">
          <IconPlus />
          <span class="ml-2 md:block hidden">Tambah</span>
        </button> -->
      </div>
    </div>
    <!-- FORM SECTION -->
    <div class="p-6 rounded-sm bg-white shadow-lg transition duration-150 ease-in">   
      <!-- TABLE FILTER SECTION -->
      <div class="flex items-center gap-4">
        <v-date-picker ref="calendar" v-model="filterDate" mode="date" :masks="masks" color="purple" title-position="left" :popover="{ visibility: 'click' }" :attributes="attrs" is-range>
          <template v-slot="{ inputValue, inputEvents, isDragging }">
            <div class="flex gap-2">
              <div class="w-1/2 mb-4">
                <div class="relative flex justify-between items-center">
                  <input id="startDate" ref="startDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" autofocus readonly>
                  <span class="h-full absolute pointer-events-none right-0">
                    <IconDateRange class="m-3" />
                  </span>
                </div>
              </div>
              <div class="w-1/2 mb-4">
                <div class="relative flex justify-between items-center">
                  <input id="endDate" ref="endDate" type="text" class="form-control" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" readonly>
                  <span class="h-full absolute pointer-events-none right-0">
                    <IconDateRange class="m-3" />
                  </span>                      
                </div>
              </div>                  
            </div>
          </template>
        </v-date-picker>
        <div class="flex -mt-4 gap-2">
          <button type="button" class="btn btn--primary" @click="runSearch()">Tampilkan</button>
          <button type="button" class="btn btn--success" @click="runSearch()">Cetak</button> 
        </div>
      </div>      
      <!-- TABLE SECTION -->
      <div class="bg-white rounded-sm overflow-y-auto">
        <table>
          <thead>
            <tr>
              <th scope="col" class="text-left">No</th>
              <th scope="col" class="text-left">Jenis Kendaraan</th>
              <th scope="col" class="text-center">Biaya Parkir</th>
              <th scope="col" class="text-center">Jumlah Kendaraan</th>
              <th scope="col" class="text-center">Total Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pendapatan.length == 0"><td class="text-center" colspan="5">Tidak ada data yang dapat ditampilkan</td></tr>
            <tr v-else-if="totalFiltered == 0"><td class="text-center" colspan="5">Tidak ada catatan yang cocok ditemukan</td></tr>
            <tr v-for="(pendapatan, index) in pendapatan" :key="pendapatan.id">
              <td class="text-left">{{ incrementIndex(index) }}</td>
              <td class="text-left">{{ pendapatan.jenis_kendaraan }}</td>
              <td class="text-right">Rp. {{ formatNumber(toFixed(pendapatan.biaya_parkir, 0)) }}</td>
              <td class="text-right">{{ formatNumber(toFixed(pendapatan.jumlah, 0)) }}</td>
              <td class="text-right">Rp. {{ formatNumber(toFixed(pendapatan.total, 0)) }}</td>
            </tr>
            <tr class="border-b border-gray-200 bg-gray-50">
              <td class="text-left font-medium" colspan="3"><span class="font-medium">GRAND TOTAL</span></td>
              <td class="text-right font-medium"><span class="font-medium">{{ formatNumber(this.totalKendaraan) }}</span></td>
              <td class="text-right font-medium"><span class="font-medium">Rp. {{ formatNumber(this.grandTotal) }}</span></td>
            </tr>            
          </tbody>                              
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import format from '@/helpers/formatNumber'
import { Field, Form, ErrorMessage } from "vee-validate"
import { createToastInterface } from 'vue-toastification'
import _, { sum } from 'lodash'
import dayjs from 'dayjs'
import aplusanServices from '@/services/aplusan/aplusanServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'

export default {
  name: 'RekapitulasiListPage',
  components: {
    Field,
    Form,
    ErrorMessage,    
    IconPlus,
    IconTrash,
    IconEdit,
    IconDateRange,
    Modal,
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
  data() {
    return {
      take: 25,
      page: 1,
      search: null,
      dateField: { field: 'created_at', name: 'Tanggal Dibuat' },
      dateFields: [
        { field: 'created_at', name: 'Tanggal Dibuat' },
        { field: 'updated_at', name: 'Tanggal Diedit' }
      ],
      filterDate: {
        start: '',
        end: ''
      },
      masks: {
        input: 'YYYY/MM/DD',
      },
      attrs: [
        {
          key: 'today',
          highlight: 'red',
          dates: new Date(),
        },
      ],
      sortField: { field: 'id', name: 'ID (Bawaan)' },
      sortFields: [
        { field: 'tanggal', name: 'Tanggal' },
        { field: 'grand_total', name: 'Grand Total' },
        { field: 'updated_at', name: 'Diedit' },
        { field: 'id', name: 'ID (Bawaan)' }
      ],        
      sortOption: { field: 'asc', name: 'Ascending' },
      sortOptions: [
        { field: 'asc', name: 'Ascending' },
        { field: 'desc', name: 'Descending' }
      ],
      awaitingSearch: false,
      totalRecords: null,
      totalFiltered: null,
      fromRecord: null,
      toRecord: null,
      currentPage: null,
      lastPage: null,
      shows: ['25', '50', '100'],
      pendapatan: [],
      error: [],
      isLoading: false,
      number: {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 2,
      }
    }
  },
  methods: {
    incrementIndex(key) {
      return key + 1
    },
    hitungTotal(props) {
      this.totalKendaraan += props.jumlah
      this.grandTotal += props.total
    },
    async fetchData() {
      try {
        this.isLoading = true

        const params = {
          take: this.take,
          page: this.page,
          search: this.search,
          date_field: this.dateField.field,
          start: this.filterDate.start || '',
          end: this.filterDate.end || '',
          sort_field: this.sortField.field,
          sort_option: this.sortOption.field
        }
        const response = await aplusanServices.fetchAll(params)
        if (response.data.status === 'success') {
          this.isLoading =false
          this.pendapatan = response.data.data
        } else {
          this.isLoading =false

          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)          
        }
      } catch (error) {
        this.isLoading =false
        console.log(error.message)
      }
    },
    updateQueryString() {
      const search = this.search ? this.search.toLowerCase() : ''
      const start = this.filterDate.start ? new Date(this.filterDate.start).toISOString().slice(0,10) : ''
      const end = this.filterDate.end ? new Date(this.filterDate.end).toISOString().slice(0,10) : ''
      const page = this.page

      this.$router.replace({ 
        query: {
          take: this.take,
          page: page,
          search: search,
          date_field: this.dateField.field,
          start: start,
          end: end,
          sort_field: this.sortField.field,
          sort_option: this.sortOption.field
        } 
      }).catch(() => {})
    },
    searchFocus(event) {
      if (event.keyCode === 191) {
        setTimeout(() => {
          this.$refs.search.focus()
        }, 5)
      }
    },
    prevPage() {
      this.page = this.currentPage - 1
      this.updateQueryString()
      this.fetchData()
    },
    nextPage() {
      this.page = this.currentPage + 1
      this.updateQueryString()
      this.fetchData()
    },
    updateTake() {
      this.page = 1
      this.updateQueryString()
      this.fetchData()      
    },
    runSearch: _.debounce(function() {
      if (!this.awaitingSearch) {
        this.page = 1
        this.updateQueryString()
        this.fetchData()
        this.awaitingSearch = false
      }
    }, 1000),
    formatNumber(num) {
      let result = format.formatNumber(num)
      return result
    },
    unformatNumber(num) {
      let result = format.unformatNumber(num)
      return result
    },
    toFixed(num, digit) {
      let result = format.toFixed(num, digit)
      return result
    },
    onlyNumber() {
      return format.onlyNumber()
    },  
  },
  created() {
    this.fetchData()
    document.addEventListener("keydown", this.searchFocus);
  },
  unmounted() {
    document.removeEventListener("keydown", this.searchFocus);
  },
  computed: {
    totalKendaraan: function() {
      let sum = 0
      this.pendapatan.forEach(function(item){
        sum += parseFloat(item.jumlah)
      })

      return sum
    },
    grandTotal: function() {
      let sum = 0
      this.pendapatan.forEach(function(item){
        sum += parseFloat(item.total)
      })

      return sum
    }    
  },
  watch: {
    '$route.query.take': {
      handler: function(take) {
        if (take) {
          this.take = take
        }
      },
      immediate: true
    },    
    '$route.query.page': {
      handler: function(page) {
        this.page = page
      },
      immediate: true
    },
    '$route.query.search': {
      handler: function(search) {
        this.search = search
      },
      immediate: true
    },
    '$route.query.date_field': {
      handler: function(date_field) {
        try {
          const option = this.dateFields.filter(item => date_field.includes(item.field))
          this.dateField = { field: option[0].field, name: option[0].name }          
        } catch (error) {
          this.dateField = { field: 'created_at', name: 'Tanggal Dibuat' }        
        }
      },
      immediate: true
    },
    '$route.query.start': {
      handler: function(start) {
        if (this.filterDate) {
          this.filterDate.start = start
        } else {
          this.filterDate = {
            'start': start
          }          
        }
      },
      immediate: true
    },
    '$route.query.end': {
      handler: function(end) {
        if (this.filterDate) {
          this.filterDate.end = end
        } else {
          this.filterDate = {
            'end': end
          }          
        }
      },
      immediate: true
    },
    '$route.query.sort_field': {
      handler: function(sort_field) {
        try {
        const option = this.sortFields.filter(item => sort_field.includes(item.field))
        this.sortField = { field: option[0].field, name: option[0].name }          
        } catch (error) {
          this.sortField = { field: 'tanggal', name: 'Tanggal' }
        }
      },
      immediate: true
    },
    '$route.query.sort_option': {
      handler: function(sort_option) {
        try {
          const option = this.sortOptions.filter(item => sort_option.includes(item.field))
          this.sortOption = { field: option[0].field, name: option[0].name }          
        } catch (error) {
          this.sortOption = { field: 'asc', name: 'Ascending' }
        }
      },
      immediate: true
    }                   
  }
}
</script>