import axios from '@/axios'

export default {
  fetchPendapatan(params){
    return axios.get(`/arus-kas/pendapatan`, {params})
  },
  fetchPengeluaran(params){
    return axios.get(`/arus-kas/pengeluaran`, {params})
  },  
}