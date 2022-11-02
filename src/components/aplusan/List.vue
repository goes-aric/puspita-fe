<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">Aplusan Pendapatan Parkir</h1>
      </div>
      <div class="flex items-center right-0 gap-2">
        <button type="button" class="btn btn--primary flex" @click="toggleNew()">
          <IconPlus />
          <span class="ml-2 md:block hidden">Tambah</span>
        </button>
      </div>
    </div>
    <!-- FORM SECTION -->
    <div class="p-6 rounded-sm bg-white shadow-lg transition duration-150 ease-in">   
      <!-- TABLE FILTER SECTION -->
      <div class="flex pb-4 justify-between items-center">
        <div class="relative">
          <select v-model="take" @change="updateTake()" class="select-form-control">
            <option v-for="show in shows" :key="show" :value="show" :selected="show === take ? 'selected' : ''">{{ show }}</option>
          </select>          
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M16.59 8.29504L12 12.875L7.41 8.29504L6 9.70504L12 15.705L18 9.70504L16.59 8.29504Z" />
            </svg>
          </div>
        </div>
        <div class="flex w-96">
          <div class="relative flex-1">
            <svg width="20" height="20" fill="currentColor" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"></path></svg>
            <input type="text" ref="search" v-model="search" @input="runSearch()" aria-label="Search" placeholder="Pencarian ( Tekan &quot;/&quot; untuk fokus )" class="search-form-control">
          </div>        
        </div>
      </div>      
      <!-- TABLE SECTION -->
      <div class="bg-white rounded-sm overflow-y-auto">
        <table>
          <thead>
            <tr>
              <th scope="col" class="text-left">Tanggal</th>
              <th scope="col" class="text-left">Nama Petugas</th>
              <th scope="col" class="text-center">Total Pendapatan</th>
              <th scope="col" class="text-center">Bukti</th>
              <th scope="col" class="text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pendapatan.length == 0"><td class="text-center" colspan="5">Tidak ada data yang dapat ditampilkan</td></tr>
            <tr v-else-if="totalFiltered == 0"><td class="text-center" colspan="5">Tidak ada catatan yang cocok ditemukan</td></tr>
            <tr v-for="(pendapatan, index) in pendapatan" :key="pendapatan.id">
              <td class="text-left">{{ pendapatan.tanggal }}</td>
              <td class="text-left">{{ pendapatan.created_user }}</td>
              <td class="text-right">Rp. {{ formatNumber(toFixed(pendapatan.grand_total, 0)) }}</td>
              <td class="text-center">
                <a :href="pendapatan.gambar" target="_blank">
                  <img class="h-10 mx-auto" :src="pendapatan.gambar">
                </a>
              </td>
              <td class="text-center">
                <div class="flex item-center justify-center">
                  <button @click="toggleEdit( pendapatan.id )" type="button" class="btn-edit" alt="Edit" title="Edit">
                    <IconEdit />
                  </button>                  
                  <button @click="confirmDialog( pendapatan.id )" type="button" class="btn-delete" alt="Hapus" title="Hapus">
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>         
          </tbody>                              
        </table>
        <div class="flex py-4 bg-white justify-between items-center">
          <div class="flex-shrink text-sm hidden md:block">
            <span>Menampilkan {{ fromRecord }} sampai {{ toRecord }} dari {{ totalFiltered }} Entri </span><span v-if="totalFiltered !== totalRecords"> ( difilter dari {{ totalRecords }} total entri )</span>
          </div>
          <div class="pagination">
            <button type="button" :disabled="(currentPage - 1) === 0" @click="prevPage" class="page-item">
              <span class="capitalize text-sm">Sebelumnya</span>
            </button>
            <button type="button" :disabled="currentPage === lastPage || currentPage > lastPage" @click="nextPage" class="page-item">
              <span class="capitalize text-sm">Berikutnya</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Dialog -->
    <modal :show="showModal" @close="showModal = false" addClass="modal-lg" modalOrientation="pt-20 lg:pt-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <Form id="modalForm" @submit="saveConfirmDialog()">
          <div class="flex w-full mb-2 gap-12">
            <div class="flex w-1/2 mb-4">
              <div class="md:w-1/4">
                <label for="tanggal" class="label-control md:py-3">Tanggal <span class="text-red-600">*</span></label>
              </div>
              <div class="md:w-3/4">
                <v-date-picker v-model="tanggal" mode="date" :masks="masks" color="purple" title-position="left" :attributes="attrs">
                  <template v-slot="{ inputValue, inputEvents }">
                    <div class="md:flex gap-6">
                      <div class="w-full">
                        <div class="relative flex justify-between items-center">
                          <input id="tanggal" type="text" class="form-control" :value="inputValue" v-on="inputEvents">
                          <span class="h-full absolute pointer-events-none right-0">
                            <IconDateRange class="m-3" />
                          </span>                      
                        </div>
                        <div v-if="error.tanggal" class="capitalize text-sm text-red-600"><span>{{ error.tanggal[0] }}</span></div>
                      </div>
                    </div>
                  </template>
                </v-date-picker>
              </div>
            </div>
            <div class="flex w-1/2 mb-4">
              <div class="md:w-1/4">
                <label for="tanggal" class="label-control">Bukti <span class="text-red-600">*</span></label>
              </div>
              <div class="md:w-3/4">
                <div class="md:h-32 border border-dashed border-gray-400 flex items-center justify-center p-1 rounded-sm mb-2">
                  <img class="h-full" :src="image" />
                </div>
                <input id="gambar" name="gambar" type="file" ref="gambar" @change="onFileChange" rules="image|ext:jpg,png" label="Gambar" />
              </div>
            </div>
          </div>
          <div class="w-full mb-4">
            <div class="md:flex gap-2">
              <div class="w-4/12 mb-2">
                <label for="jenis_kendaraan" class="label-control">Jenis Kendaraan <span class="text-red-600">*</span></label>
                <VueMultiselect id="jenis_kendaraan" name="jenis_kendaraan" ref="jenisKendaraan" v-model="jenisKendaraan" :options="jenisKendaraanOptions" :showLabels="false" label="nama" track-by="nama" placeholder="Pilih Jenis Kendaraan">
                  <template v-slot:caret>
                    <div>
                      <div class="multiselect__select">
                        <span>
                          <svg class="text-gray-500 my-2 ml-1 w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M16.59 8.29504L12 12.875L7.41 8.29504L6 9.70504L12 15.705L18 9.70504L16.59 8.29504Z"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </template>
                </VueMultiselect>
                <ErrorMessage name="jenis_kendaraan" class="capitalize text-sm text-red-600" />
                <div v-if="error.jenis_kendaraan" class="capitalize text-sm text-red-600"><span>{{ error.jenis_kendaraan[0] }}</span></div>                   
              </div>
              <div class="w-2/12 mb-2">
                <label for="biaya_parkir" class="label-control">Biaya Parkir <span class="text-red-600">*</span></label>
                <Field id="biaya_parkir" name="biaya_parkir" type="text" v-model="biayaParkir" label="Biaya Parkir" maxlength="255" rules="" class="form-control" readonly />
                <ErrorMessage name="biaya_parkir" class="capitalize text-sm text-red-600" />
                <div v-if="error.biaya_parkir" class="capitalize text-sm text-red-600"><span>{{ error.biaya_parkir[0] }}</span></div>                
              </div>
              <div class="w-2/12 mb-2">
                <label for="jumlah_kendaraan" class="label-control">Jml Kendaraan <span class="text-red-600">*</span></label>
                <Field id="jumlah_kendaraan" name="jumlah_kendaraan" v-model.lazy="jumlahKendaraan" v-number="number" label="Jumlah Kendaraan" type="text" rules="" @input="hitungTotal($event)" class="form-control" />
                <ErrorMessage name="jumlah_kendaraan" class="capitalize text-sm text-red-600" />
                <div v-if="error.jumlah_kendaraan" class="capitalize text-sm text-red-600"><span>{{ error.jumlah_kendaraan[0] }}</span></div>                
              </div>
              <div class="w-2/12 mb-2">
                <label for="jumlah_total" class="label-control">Jumlah Total <span class="text-red-600">*</span></label>
                <Field id="jumlah_total" name="jumlah_total" type="text" v-model="jumlahTotal" label="Jumlah Total" maxlength="255" rules="" class="form-control" readonly />
                <ErrorMessage name="jumlah_total" class="capitalize text-sm text-red-600" />
                <div v-if="error.jumlah_total" class="capitalize text-sm text-red-600"><span>{{ error.jumlah_total[0] }}</span></div>                
              </div>
              <div class="w-1/12 mb-2">
                <button :disabled="isLoading" type="button" class="btn btn--success mt-6 flex" @click="addPendapatan()">
                  <span>Tambah</span>
                </button>
              </div>
            </div>            
            <table class="min-w-max w-full table-auto">
              <thead>
                <tr>
                  <th scope="col" class="text-left">Jenis Kendaraan</th>
                  <th scope="col" class="text-center">Biaya Parkir</th>
                  <th scope="col" class="text-center">Jml Kendaraan</th>
                  <th scope="col" class="text-center">Jumlah Total</th>
                  <th scope="col" class="px-3 text-center">Aksi</th>
                </tr>                                                         
              </thead>
              <tbody class="text-gray-600 font-light">
                <tr v-if="pendapatanParkir.length == 0" class="border-b"><td class="py-3 px-6 text-sm text-center" colspan="5">Tidak ada data yang dapat ditampilkan</td></tr>
                <tr v-for="(item, index) in pendapatanParkir" :key="item.id" class="border-b">
                  <td class="text-left">{{ item.jenis_kendaraan }}</td>
                  <td class="text-right">{{ this.formatNumber(this.toFixed(item.biaya_parkir, 0)) }}</td>
                  <td class="text-right">{{ this.formatNumber(this.toFixed(item.jumlah_kendaraan, 0)) }}</td>
                  <td class="text-right">{{ this.formatNumber(this.toFixed(item.jumlah_total, 0)) }}</td>
                  <td class="px-3 text-center">
                    <div class="flex item-center justify-center">
                      <button @click="removePendapatan( index )" type="button" class="btn-delete" alt="Hapus">
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <td class="text-left font-medium" colspan="3"><span class="font-medium">GRAND TOTAL</span></td>
                  <td class="text-right font-medium"><span class="font-medium">{{ formatNumber(toFixed(this.grandTotal, 0)) }}</span></td>
                  <td class="text-center"></td>
                </tr>
              </tbody>
            </table>            
          </div>
        </Form>     
      </template>
      <template v-slot:footer>
        <button :disabled="isLoading" type="submit" form="modalForm" class="btn btn--primary" alt="Simpan" title="Simpan">
          Simpan
        </button>
      </template> 
    </modal>
  </div>
</template>

<script>
import format from '@/helpers/formatNumber'
import { Field, Form, ErrorMessage } from "vee-validate"
import { createToastInterface } from 'vue-toastification'
import _ from 'lodash'
import dayjs from 'dayjs'
import kendaraanServices from '@/services/kendaraan/kendaraanServices'
import aplusanServices from '@/services/aplusan/aplusanServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'

export default {
  name: 'AplusanListPage',
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
      modalTitle: '',     
      showModal: false,      
      isEdit: false,
      pendapatanId: '',
      tanggal: '',
      image: '',
      pendapatanImage: '',      
      jenisKendaraan: '',
      jenisKendaraanOptions: [],
      biayaParkir: '',
      jumlahKendaraan: '',
      jumlahTotal: '',
      grandTotal: '',
      pendapatanParkir: [],
      isLoading: false,
      number: {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 2,
      },       
    }
  },
  methods: {
    async fetchKendaraanOptions() {
      try {
        const response = await kendaraanServices.fetchDataOptions(null)
        if (response.data.status === 'success') {
          const records = response.data.data
          this.jenisKendaraanOptions = []
          records.forEach(element => {
            this.jenisKendaraanOptions.push({
              'id': element.id,
              'nama': element.jenis_kendaraan,
              'biaya': element.biaya_parkir,
            })
          })          
        } else {
          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)          
        }
      } catch (error) {
        console.log(error.message)
      }
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
        const response = await aplusanServices.fetchLimit(params)
        if (response.data.status === 'success') {
          this.isLoading =false

          const records = response.data.data
          this.totalRecords = records.total
          this.totalFiltered = records.total_filter
          this.fromRecord = records.from
          this.toRecord = records.to
          this.currentPage = records.current_page
          this.lastPage = records.last_page
          this.pendapatan = records.data
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
    async delete(id) {
      try {
        const response = await aplusanServices.delete(id)
        return response.data
      } catch (error) {     
        return error
      }
    },
    async confirmDialog(id) {
      // console.log(id)
      this.$swal.fire({
        title: 'Anda yakin akan menghapusnya?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#4b5563',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          /* CALL DELETE FUNCTION */
          const result = this.delete(id)
          const response = await result

          if (response.status) {
            if (response.status === 'success') {
              /* REFRESH DATA */
              this.fetchData()

              this.$swal.fire({
                title: 'Dihapus!',
                text: "Catatan Anda telah dihapus",
                icon: 'success',
                showConfirmButton: false,
                timer: 3000            
              })              
            } else {
              this.$swal.fire({
                title: 'Gagal!',
                text: response.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 3000            
              })              
            }
          } else {
            this.toast.error(response.message)
          }
        }
      })
    },
    async saveConfirmDialog() {
      this.$swal.fire({
        title: 'Konfirmasi Data',
        text: "Anda yakin data yang dimasukan sudah benar?",
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#4b5563',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          /* CALL CREATE FUNCTION */
          this.save()
        }
      })
    },
    async fetchDataById(id){
      try {
        this.isLoading = true
        const response = await aplusanServices.fetchById(id)
        if (response.data.status === 'success') {
          this.isLoading = false
          this.record = response.data.data

          this.tanggal = this.record.tanggal
          this.image = this.record.gambar
          this.record.details.forEach(element => {
            this.pendapatanParkir.push({
              id: element.id_kendaraan,
              jenis_kendaraan: element.jenis_kendaraan,
              biaya_parkir: element.biaya_parkir,
              jumlah_kendaraan: element.jumlah_kendaraan,
              jumlah_total: element.total
            })
          })
          this.grandTotal = this.record.grand_total
        } else {
          this.isLoading = false

          /* THROW ERROR MESSAGES */
          this.toast.error(response.data.message)            
        }
      } catch (error) {
        this.isLoading = false
        console.log(error.message)
      }
    },     
    async save(){
      try {
        this.isLoading = true
        let payload = new FormData()
        payload.append('tanggal', dayjs(this.tanggal).format('YYYY/MM/DD'))
        payload.append('gambar', this.pendapatanImage)
        payload.append('pendapatan', JSON.stringify(this.pendapatanParkir))

        let response = ''
        if (this.isEdit) {
          payload.append('_method', 'PUT')
          response = await aplusanServices.update(this.pendapatanId, payload)
        } else {
          response = await aplusanServices.create(payload)
        }
        
        if (response.data.status === 'success') {
          /* SET IS EDIT STATE TO FALSE */
          this.isEdit = false

          /* SET LOADING STATE IS FALSE */
          this.isLoading = false

          this.showModal = false

          /* EMPTY ERRORS VARIABLE */
          this.error = []
          
          /* SUCCESS MESSAGES */
          this.toast.success(response.data.message)

          /* RELOAD DATA */
          this.fetchData()
        } else {
          /* SET LOADING STATE IS FALSE */
          this.isLoading = false

          /* EMPTY ERRORS VARIABLE */
          this.error = []

          /* STORE RESPONSE MESSAGE TO A VARIABLE */
          let responseReturn = response.data.message

          /* IF RESPONSE HAS OBJECT, STORE RESPONSE TO ERRORS VARIABLE */
          if (responseReturn.tanggal || responseReturn.gambar) {
              this.error = response.data.message

          /* ELSE, THROW ERROR MESSAGES */
          } else {
            this.toast.error(response.data.message)
          }          
        }        
      } catch (error) {
        /* SET LOADING STATE IS FALSE */
        this.isLoading = false

        /* THROW ERROR MESSAGES */
        this.toast.error(error.message)        
      }
    },
    clearHeader(){
      this.tanggal = new Date()
      this.image = ''
      this.pendapatanParkir = []
      this.grandTotal = ''      
    },
    clearForm(){
      this.jenisKendaraan = ''
      this.biayaParkir = ''
      this.jumlahKendaraan = ''
      this.jumlahTotal = ''
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
    toggleNew() {
      this.isEdit = false
      this.error = []
      this.showModal = true
      this.modalTitle = 'Tambah Aplusan Parkir'
      this.clearHeader()
      this.clearForm()
      this.pendapatanId = ''
      this.$refs.jenisKendaraan.$el.focus()
    },
    toggleEdit(id) {
      this.isEdit = true
      this.error = []
      this.showModal = true
      this.modalTitle = 'Edit Aplusan Parkir'
      this.clearHeader()    
      this.clearForm()
      this.pendapatanId = id
      this.fetchDataById(id)
    },
    addPendapatan() {
      if (this.jenisKendaraan && this.biayaParkir && this.jumlahKendaraan && this.jumlahTotal) {
        const find = this.pendapatanParkir.filter(data => data.id == this.jenisKendaraan.id)
        if (find.length == 0) {
          this.pendapatanParkir.push({
            id: this.jenisKendaraan.id,
            jenis_kendaraan: this.jenisKendaraan.nama,
            biaya_parkir: this.unformatNumber(this.biayaParkir),
            jumlah_kendaraan: this.unformatNumber(this.jumlahKendaraan),
            jumlah_total: this.unformatNumber(this.jumlahTotal)
          })
          let temp = this.grandTotal ? parseFloat(this.unformatNumber(this.grandTotal, 0)) : 0
          let jumlahTotal = this.jumlahTotal ? parseFloat(this.unformatNumber(this.jumlahTotal, 0)) : 0
          this.grandTotal = temp + jumlahTotal
          this.clearForm()
        }
      } else {
        this.toast.error('Silakan lengkapi masukan data terlebih dahulu!')
      }
    },
    removePendapatan(index) {
      this.pendapatanParkir.splice(index, 1)

      let tempTotal = 0
      this.pendapatanParkir.forEach(item => {
        tempTotal += parseFloat(this.unformatNumber(item.jumlah_total, 0))    
      })
      this.grandTotal = tempTotal
    },
    hitungTotal(event) {
      let jumlahTotal = this.unformatNumber(this.biayaParkir) * this.unformatNumber(event.target.value)
      this.jumlahTotal = this.formatNumber(this.toFixed(jumlahTotal, 0))
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }

      this.createImage(files[0])
    },
    createImage(file) {
      let reader = new FileReader()
      let vm = this

      reader.onload = (e) => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
      this.pendapatanImage = this.$refs.gambar.files[0]
    },
    removeImage() {
      this.image = ''
    },     
  },
  created() {
    this.fetchData()
    this.fetchKendaraanOptions()
    document.addEventListener("keydown", this.searchFocus);
  },
  unmounted() {
    document.removeEventListener("keydown", this.searchFocus);
  },
  watch: {
    jenisKendaraan: function() {
      this.biayaParkir = this.jenisKendaraan ? this.formatNumber(this.toFixed( this.jenisKendaraan.biaya, 0)) : null
    },
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