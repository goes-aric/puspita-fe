import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/pengeluaran/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/pengeluaran`, {params})
  },  
  fetchById(id){
    return axios.get(`/pengeluaran/${id}`)
  },
  create(payload){
    return axios.post(`/pengeluaran`, payload)
  },
  update(id, payload){
    return axios.post(`/pengeluaran/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/pengeluaran/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/pengeluaran`, payload)
  },
}