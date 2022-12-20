<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">Laporan Arus Kas</h1>
      </div>
      <div class="flex items-center right-0 gap-2"></div>
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
          <button type="button" class="btn btn--success" v-print="printObj">Cetak</button> 
        </div>
      </div>      
      <!-- TABLE SECTION -->
      <div id="canvasData" class="bg-white rounded-sm overflow-y-auto">
        <div class="flex w-full border-b-2 border-gray-900 pb-2 mb-4 gap-2">
          <div class="w-1/12">
            <img :src="LogoSource" class="h-16 mx-auto">
          </div>
          <div class="w-11/12 text-center">
            <h1 class="text-2xl uppercase">Perusahaan Umum Daerah Pasar Mangu Giri Sedana</h1>
            <h1 class="text-2xl uppercase">Unit Pasar Umum Beringkit</h1>
            <span>Jalan I Gusti Ngurah Rai Mengwi Badung</span>
          </div>
        </div>
        <div v-if="filterDate.start" class="w-full text-center mb-2">
          <h2 class="text-xl">Laporan Arus Kas</h2>
          <span class="text-sm">{{ tanggalAwal }} s/d {{ tanggalAkhir }}</span>
        </div>
        <div class="border p-4 text-sm">
          <h2 class="font-semibold border-b pb-2 mb-2 uppercase">Arus Kas Dari Aktivitas Operasional</h2>
          <div class="w-full">
            <div v-for="(pendapatan, index) in pendapatan" :key="pendapatan.id" class="text-sm mb-4">
              <h3 class="py-2 font-medium">{{ pendapatan.nama }} :</h3>
              <template v-for="item in pendapatan.transaksi" :key="item.kode">
                <div class="flex ml-5 pb-2">
                  <div class="w-1/2">{{ item.keterangan }}</div>
                  <div class="w-1/2 text-right">{{ (item.saldo) < 0 ? '(' + formatNumber(toFixed(item.saldo, 0)) + ')' : formatNumber(toFixed(item.saldo, 0)) }}</div>
                </div>
              </template>
              <div class="flex font-medium border-t py-2">
                <div class="w-1/2">Jumlah {{ pendapatan.nama }}</div>
                <div class="w-1/2 text-right">{{ pendapatan.total < 0 ? '(' + formatNumber(toFixed(pendapatan.total, 0)) + ')' : formatNumber(toFixed(pendapatan.total, 0)) }}</div>
              </div>
            </div>
            <div v-for="(pengeluaran, index) in pengeluaran" :key="pengeluaran.id" class="text-sm mb-4">
              <h3 class="py-2 font-medium">{{ pengeluaran.nama }} :</h3>
              <template v-for="item in pengeluaran.transaksi" :key="item.kode">
                <div class="flex ml-5 pb-2">
                  <div class="w-1/2">{{ item.keterangan }}</div>
                  <div class="w-1/2 text-right">{{ (item.saldo) < 0 ? '(' + formatNumber(toFixed(item.saldo, 0)) + ')' : formatNumber(toFixed(item.saldo, 0)) }}</div>
                </div>
              </template>
              <div class="flex font-medium border-t py-2">
                <div class="w-1/2">Jumlah {{ pengeluaran.nama }}</div>
                <div class="w-1/2 text-right">{{ pengeluaran.total < 0 ? '(' + formatNumber(toFixed(pengeluaran.total, 0)) + ')' : formatNumber(toFixed(pengeluaran.total, 0)) }}</div>
              </div>
            </div>            
            <div class="flex font-medium border-t py-2">
              <div class="w-1/2">Saldo Kas Awal</div>
              <div class="w-1/2 text-right">{{ (saldoAwalPendapatan-saldoAwalPengeluaran) < 0 ? '(' + formatNumber(toFixed((saldoAwalPendapatan-saldoAwalPengeluaran), 0)) + ')' : formatNumber(toFixed((saldoAwalPendapatan-saldoAwalPengeluaran), 0)) }}</div>
            </div>
            <div class="flex font-medium border-t py-2">
              <div class="w-1/2">Mutasi Kas</div>
              <div class="w-1/2 text-right">{{ (totalPendapatan-totalPengeluaran) < 0 ? '(' + formatNumber(toFixed((totalPendapatan-totalPengeluaran), 0)) + ')' : formatNumber(toFixed((totalPendapatan-totalPengeluaran), 0)) }}</div>
            </div>
            <div class="flex font-medium border-t py-2">
              <div class="w-1/2">Saldo Kas Akhir</div>
              <div class="w-1/2 text-right">{{ ((saldoAwalPendapatan-saldoAwalPengeluaran)+(totalPendapatan-totalPengeluaran)) < 0 ? '(' + formatNumber(toFixed(((saldoAwalPendapatan-saldoAwalPengeluaran)+(totalPendapatan-totalPengeluaran)), 0)) + ')' : formatNumber(toFixed(((saldoAwalPendapatan-saldoAwalPengeluaran)+(totalPendapatan-totalPengeluaran)), 0)) }}</div>
            </div>              
          </div>        
        </div>
        <div class="flex w-full mt-6">
          <div class="w-1/3"></div>
          <div class="w-1/3"></div>
          <div class="w-1/3 text-center">
            <span class="block text-sm mb-8">KA. UNIT PASAR UMUM BERINGKIT</span>
            <span class="text-sm underline">(I PUTU RUDITA)</span>
          </div>
        </div>
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
import arusKasServices from '@/services/arusKas/arusKasServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'
import Logo from '../../assets/images/logo.png'

export default {
  name: 'ArusKasListPage',
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
      filterDate: {
        start: new Date(),
        end: new Date()
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
      pendapatan: [],
      totalPendapatan: 0,
      saldoAwalPendapatan: 0,
      pengeluaran: [],
      totalPengeluaran: 0,
      saldoAwalPengeluaran: 0,
      totalSaldoAwal: 0,
      totalMutasiKas: 0,
      totalSaldoAkhir: 0,
      error: [],
      isLoading: false,
      number: {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 2,
      },
      printObj: {
        id: "canvasData",
        popTitle: 'Laporan Arus Kas',
        beforeOpenCallback (vue) {
          vue.printLoading = true
          console.log('打开之前')
        },
        openCallback (vue) {
          vue.printLoading = false
          console.log('执行了打印')
        },
        closeCallback () {
          console.log('关闭了打印工具')
        }
      },
      LogoSource: Logo,
      tanggalAwal: '',
      tanggalAkhir: ''
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
    async fetchDataPendapatan() {
      try {
        this.isLoading = true

        const params = {
          start: this.filterDate.start || '',
          end: this.filterDate.end || ''
        }
        const response = await arusKasServices.fetchPendapatan(params)
        if (response.data.status === 'success') {
          this.isLoading =false
          const records = response.data.data
          this.pendapatan = []
          let total = 0
          let totalAwal = 0
          records.forEach(data => {
            let totalItem = 0
            let totalItemSaldoAwal = 0
            let transaksi = []
            data.transaksi.forEach(item => {
              transaksi.push(item)           
              totalItem += parseFloat(item.saldo)
            })
            this.pendapatan.push({
              id: data.id,
              nama: data.nama,
              transaksi: transaksi,
              total: totalItem
            })
            total += parseFloat(totalItem)

            data.saldo_awal.forEach(item => {     
              totalItemSaldoAwal += parseFloat(item.saldo)
            })
            totalAwal += totalItemSaldoAwal
          })
          this.saldoAwalPendapatan = totalAwal
          this.totalPendapatan = total
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
    async fetchDataPengeluaran() {
      try {
        this.isLoading = true

        const params = {
          start: this.filterDate.start || '',
          end: this.filterDate.end || ''
        }
        const response = await arusKasServices.fetchPengeluaran(params)
        if (response.data.status === 'success') {
          this.isLoading =false
          const records = response.data.data
          this.pengeluaran = []
          let total = 0
          let totalAwal = 0
          records.forEach(data => {
            let totalItem = 0
            let totalItemSaldoAwal = 0
            let transaksi = []
            data.transaksi.forEach(item => {
              transaksi.push(item)           
              totalItem += parseFloat(item.saldo)
            })
            this.pengeluaran.push({
              id: data.id,
              nama: data.nama,
              transaksi: transaksi,
              total: totalItem
            })
            total += parseFloat(totalItem)

            data.saldo_awal.forEach(item => {     
              totalItemSaldoAwal += parseFloat(item.saldo)
            })
            totalAwal += totalItemSaldoAwal
          })
          this.saldoAwalPengeluaran = totalAwal
          this.totalPengeluaran = total
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
    runSearch() {
      this.fetchDataPendapatan()
      this.fetchDataPengeluaran()
    },
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
    this.fetchDataPendapatan()
  },
  watch: {
    filterDate: function() {
      this.tanggalAwal = this.filterDate.start ? dayjs(this.filterDate.start).format('DD MMM YYYY') : ''
      this.tanggalAkhir = this.filterDate.end ? dayjs(this.filterDate.end).format('DD MMM YYYY') : ''
    },
  }  
}
</script>