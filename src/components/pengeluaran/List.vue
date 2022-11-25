<template>
  <div>
    <div class="breadcrumb flex justify-between">
      <div class="w-full md:w-1/2 flex items-baseline gap-4">
        <h1 class="text-2xl bottom-0">Pengeluaran Parkir</h1>
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
              <th scope="col" class="text-left">Bulan</th>
              <th scope="col" class="text-center">Total Pengeluaran</th>
              <th scope="col" class="text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pengeluaran.length == 0"><td class="text-center" colspan="5">Tidak ada data yang dapat ditampilkan</td></tr>
            <tr v-else-if="totalFiltered == 0"><td class="text-center" colspan="5">Tidak ada catatan yang cocok ditemukan</td></tr>
            <tr v-for="(pengeluaran, index) in pengeluaran" :key="pengeluaran.id">
              <td class="text-left">{{ pengeluaran.bulan }} {{ pengeluaran.tahun }}</td>
              <td class="text-right">Rp. {{ formatNumber(toFixed(pengeluaran.grand_total, 0)) }}</td>
              <td class="text-center">
                <div class="flex item-center justify-center">
                  <button @click="togglePrint( pengeluaran )" type="button" class="btn-edit" alt="Print" title="Print">
                    <IconPrint />
                  </button>                  
                  <template v-if="userData.jabatan == 'Admin'">
                    <button @click="toggleEdit( pengeluaran.id )" type="button" class="btn-edit" alt="Edit" title="Edit">
                      <IconEdit />
                    </button>
                    <button @click="confirmDialog( pengeluaran.id )" type="button" class="btn-delete" alt="Hapus" title="Hapus">
                      <IconTrash />
                    </button>                  
                  </template>
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
            <div class="w-1/2 mb-4">
              <div class="flex w-full mb-2">
                <div class="md:w-2/5">
                  <label for="bulan" class="label-control md:py-3">Bulan <span class="text-red-600">*</span></label>
                </div>
                <div class="md:w-3/5">
                  <VueMultiselect id="bulan" name="bulan" ref="bulan" v-model="bulan" :options="bulanOptions" :showLabels="false" placeholder="Pilih Bulan">
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
                  <ErrorMessage name="bulan" class="capitalize text-sm text-red-600" />
                  <div v-if="error.bulan" class="capitalize text-sm text-red-600"><span>{{ error.bulan[0] }}</span></div>
                </div>
              </div>
              <div class="flex w-full mb-2">
                <div class="md:w-2/5">
                  <label for="tahun" class="label-control md:py-3">Tahun <span class="text-red-600">*</span></label>
                </div>
                <div class="md:w-3/5">
                  <Field id="tahun" name="tahun" v-model="tahun" label="Tahun" type="text" rules="numeric" class="form-control" />
                  <ErrorMessage name="tahun" class="capitalize text-sm text-red-600" />
                  <div v-if="error.tahun" class="capitalize text-sm text-red-600"><span>{{ error.tahun[0] }}</span></div>
                </div>
              </div>
            </div>
            <div class="flex w-1/2 mb-4"></div>
          </div>
          <div class="w-full mb-4">
            <div class="md:flex gap-2">
              <div class="w-2/12 mb-2">
                <label for="tanggal" class="label-control">Tanggal <span class="text-red-600">*</span></label>
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
              <div class="w-5/12 mb-2">
                <label for="akun" class="label-control">Pengeluaran <span class="text-red-600">*</span></label>
                <VueMultiselect id="akun" name="akun" ref="akun" v-model="akun" :options="akunOptions" :showLabels="false" label="nama_akun" track-by="nama_akun" placeholder="Pilih Jenis Pengeluaran">
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
                <ErrorMessage name="akun" class="capitalize text-sm text-red-600" />
                <div v-if="error.akun" class="capitalize text-sm text-red-600"><span>{{ error.akun[0] }}</span></div>                   
              </div>
              <div class="w-3/12 mb-2">
                <label for="jumlah_pengeluaran" class="label-control">Jumlah Pengeluaran <span class="text-red-600">*</span></label>
                <Field id="jumlah_pengeluaran" name="jumlah_pengeluaran" v-model.lazy="jumlahPengeluaran" v-number="number" label="Jumlah Pengeluaran" type="text" rules="" class="form-control text-right" />
                <ErrorMessage name="jumlah_pengeluaran" class="capitalize text-sm text-red-600" />
                <div v-if="error.jumlah_pengeluaran" class="capitalize text-sm text-red-600"><span>{{ error.jumlah_pengeluaran[0] }}</span></div>
              </div>
              <div class="w-1/12 mb-2">
                <button :disabled="isLoading" type="button" class="btn btn--success mt-6 flex" @click="addPengeluaran()">
                  <span>Tambah</span>
                </button>
              </div>
            </div>            
            <table class="min-w-max w-full table-auto">
              <thead>
                <tr>
                  <th scope="col" class="text-left">Tanggal</th>
                  <th scope="col" class="text-left">Kode</th>
                  <th scope="col" class="text-left">Pengeluaran</th>
                  <th scope="col" class="text-center">Jumlah Pengeluaran</th>
                  <th scope="col" class="px-3 text-center">Aksi</th>
                </tr>                                                         
              </thead>
              <tbody class="text-gray-600 font-light">
                <tr v-if="pengeluaranParkir.length == 0" class="border-b"><td class="py-3 px-6 text-sm text-center" colspan="5">Tidak ada data yang dapat ditampilkan</td></tr>
                <tr v-for="(item, index) in pengeluaranParkir" :key="item.id" class="border-b">
                  <td class="text-left">{{ item.tanggal }}</td>
                  <td class="text-left">{{ item.kode_akun }}</td>
                  <td class="text-left">{{ item.nama_akun }}</td>
                  <td class="text-right">{{ formatNumber(toFixed(item.jumlah_pengeluaran, 0)) }}</td>
                  <td class="px-3 text-center">
                    <div class="flex item-center justify-center">
                      <button @click="removePengeluaran( index )" type="button" class="btn-delete" alt="Hapus">
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

    <!-- Modal Dialog Print -->
    <modal :show="showModalPrint" @close="showModalPrint = false" addClass="modal-lg" modalOrientation="pt-20 lg:pt-6">
      <template v-slot:header><h3>{{ modalTitle }}</h3></template>
      <template v-slot:body>
        <div id="canvasData" class="bg-white rounded-sm overflow-y-auto">
          <div class="flex w-full border-b-2 border-gray-900 pb-2 mb-4 gap-2">
            <div class="w-1/12">
              <img :src="LogoSource" class="h-16 mx-auto">
            </div>
            <div class="w-11/12 text-center">
              <h1 class="text-xl uppercase">Perusahaan Umum Daerah Pasar Mangu Giri Sedana</h1>
              <h1 class="text-xl uppercase">Unit Pasar Umum Beringkit</h1>
              <span>Jalan I Gusti Ngurah Rai Mengwi Badung</span>
            </div>
          </div>
          <div class="block mb-2">
            <h2 class="font-medium text-center">Laporan Pengeluaran</h2>
          </div>
          <div class="block mb-2">
            <h2 class="text-sm text-left">{{ printData.bulan + ' ' + printData.tahun }}</h2>
          </div>          
          <table>
            <thead>
              <tr>
                <th scope="col" class="bg-white text-gray-800 text-left">No</th>
                <th scope="col" class="bg-white text-gray-800 text-left">Tanggal</th>
                <th scope="col" class="bg-white text-gray-800 text-left">Pengeluaran</th>
                <th scope="col" class="bg-white text-gray-800 text-center">Jumlah (Rp.)</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="printData.details">
                <tr v-if="printData.details.length == 0"><td class="text-center" colspan="3">Tidak ada data yang dapat ditampilkan</td></tr>
                <tr v-for="(pengeluaran, index) in printData.details" :key="pengeluaran.id">
                  <td class="bg-white text-gray-800 border-gray-200 text-left">{{ incrementIndex(index) }}</td>
                  <td class="bg-white text-gray-800 border-gray-200 text-left">{{ formatedDate(pengeluaran.tanggal) }}</td>
                  <td class="bg-white text-gray-800 border-gray-200 text-left">{{ pengeluaran.nama_akun }}</td>
                  <td class="bg-white text-gray-800 border-gray-200 text-right">Rp. {{ formatNumber(toFixed(pengeluaran.jumlah_pengeluaran, 0)) }}</td>
                </tr>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <td class="bg-white text-gray-800 border-gray-200 text-left font-medium" colspan="3"><span class="font-medium">GRAND TOTAL</span></td>
                  <td class="bg-white text-gray-800 border-gray-200 text-right font-medium"><span class="font-medium">Rp. {{ formatNumber(toFixed(this.printData.grand_total, 0)) }}</span></td>
                </tr>                   
              </template>         
            </tbody>                              
          </table>
          <div class="flex w-full mt-4">
            <div class="w-1/3"></div>
            <div class="w-1/3"></div>
            <div class="w-1/3 text-center">
              <span class="block text-sm mb-8">KA. UNIT PASAR UMUM BERINGKIT</span>
              <span class="text-sm underline">(I PUTU RUDITA)</span>
            </div>
          </div>
        </div>   
      </template>
      <template v-slot:footer>
        <button :disabled="isLoading" type="button" v-print="printObj" class="btn btn--primary" alt="Cetak" title="Cetak">
          Cetak
        </button>
      </template> 
    </modal>    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import format from '@/helpers/formatNumber'
import { Field, Form, ErrorMessage } from "vee-validate"
import { createToastInterface } from 'vue-toastification'
import _ from 'lodash'
import dayjs from 'dayjs'
import akunServices from '@/services/akun/akunServices'
import pengeluaranServices from '@/services/pengeluaran/pengeluaranServices'
import IconPlus from '../icons/IconPlus.vue'
import IconTrash from '../icons/IconTrash.vue'
import IconEdit from '../icons/IconEdit.vue'
import IconPrint from '../icons/IconPrint.vue'
import IconDateRange from '../icons/IconDateRange.vue'
import Modal from '../widgets/Modal.vue'
import Logo from '../../assets/images/logo.png'

export default {
  name: 'PengeluaranListPage',
  components: {
    Field,
    Form,
    ErrorMessage,    
    IconPlus,
    IconTrash,
    IconEdit,
    IconPrint,
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
      pengeluaran: [],
      error: [],
      modalTitle: '',     
      showModal: false,      
      isEdit: false,
      pengeluaranId: '',
      bulan: '',
      bulanOptions: ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOPEMBER', 'DESEMBER'],
      tahun: '',
      akun: '',
      akunOptions: [],
      tanggal: '',
      jumlahPengeluaran: '',
      grandTotal: '',
      pengeluaranParkir: [],
      isLoading: false,
      number: {
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 2,
      },
      showModalPrint: false,
      printData: [],
      printObj: {
        id: "canvasData",
        popTitle: 'Laporan Pengeluaran',
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
    }
  },
  methods: {
    async fetchAkunOptions() {
      try {
        const response = await akunServices.fetchDataOptions(null)
        if (response.data.status === 'success') {
          const records = response.data.data
          this.akunOptions = []
          records.forEach(element => {
            this.akunOptions.push({
              'id': element.id,
              'kode_akun': element.kode_akun,
              'nama_akun': element.nama_akun,
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
        const response = await pengeluaranServices.fetchLimit(params)
        if (response.data.status === 'success') {
          this.isLoading =false

          const records = response.data.data
          this.totalRecords = records.total
          this.totalFiltered = records.total_filter
          this.fromRecord = records.from
          this.toRecord = records.to
          this.currentPage = records.current_page
          this.lastPage = records.last_page
          this.pengeluaran = records.data
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
        const response = await pengeluaranServices.delete(id)
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
        const response = await pengeluaranServices.fetchById(id)
        if (response.data.status === 'success') {
          this.isLoading = false
          this.record = response.data.data

          this.bulan = this.record.bulan
          this.tahun = this.record.tahun
          this.record.details.forEach(element => {
            this.pengeluaranParkir.push({
              id: element.id,
              kode_akun: element.kode_akun,
              nama_akun: element.nama_akun,
              tanggal: dayjs(element.tanggal).format("YYYY-MM-DD"),
              jumlah_pengeluaran: element.jumlah_pengeluaran       
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
        payload.append('bulan', this.bulan || null)
        payload.append('tahun', this.tahun)
        payload.append('pengeluaran', JSON.stringify(this.pengeluaranParkir))

        let response = ''
        if (this.isEdit) {
          payload.append('_method', 'PUT')
          response = await pengeluaranServices.update(this.pengeluaranId, payload)
        } else {
          response = await pengeluaranServices.create(payload)
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
          if (responseReturn.bulan || responseReturn.tahun) {
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
      this.bulan = ''
      this.tahun = ''
      this.pengeluaranParkir = []
      this.grandTotal = ''      
    },
    clearForm(){
      this.akun = ''
      this.tanggal = ''
      this.jumlahPengeluaran = ''
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
      this.modalTitle = 'Tambah Pengeluaran Parkir'
      this.clearHeader()
      this.clearForm()
      this.pengeluaranId = ''
      this.$refs.akun.$el.focus()
    },
    toggleEdit(id) {
      this.isEdit = true
      this.error = []
      this.showModal = true
      this.modalTitle = 'Edit Pengeluaran Parkir'
      this.clearHeader()    
      this.clearForm()
      this.pengeluaranId = id
      this.fetchDataById(id)
    },
    addPengeluaran() {
      if (this.akun && this.tanggal && this.jumlahPengeluaran) {
        this.pengeluaranParkir.push({
          id: this.akun.id,
          kode_akun: this.akun.kode_akun,
          nama_akun: this.akun.nama_akun,
          tanggal: dayjs(this.tanggal).format("YYYY-MM-DD"),
          jumlah_pengeluaran: this.unformatNumber(this.jumlahPengeluaran)
        })

        let temp = this.grandTotal ? parseFloat(this.unformatNumber(this.grandTotal)) : 0
        let jumlahPengeluaran = this.jumlahPengeluaran ? parseFloat(this.unformatNumber(this.jumlahPengeluaran)) : 0
        this.grandTotal = temp + jumlahPengeluaran
        this.clearForm()
      } else {
        this.toast.error('Silakan lengkapi masukan data terlebih dahulu!')
      }
    },
    removePengeluaran(index) {
      this.pengeluaranParkir.splice(index, 1)

      let tempTotal = 0
      this.pengeluaranParkir.forEach(item => {
        tempTotal += parseFloat(this.unformatNumber(item.jumlah_pengeluaran, 0))    
      })
      this.grandTotal = tempTotal
    },
    incrementIndex(key) {
      return key + 1
    },    
    togglePrint(data) {
      this.printData = data
      this.showModalPrint = true
      this.modalTitle = 'Cetak Pengeluaran'      
    },
    formatedDate(date) {
      return dayjs(date).format("DD-MM-YYYY")
    },
  },
  created() {
    this.fetchData()
    this.fetchAkunOptions()
    document.addEventListener("keydown", this.searchFocus);
  },
  unmounted() {
    document.removeEventListener("keydown", this.searchFocus);
  },
  computed: {
    ...mapGetters({
      userData: 'user'
    })
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
          this.sortField = { field: 'bulan', name: 'Bulan' }
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