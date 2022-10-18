import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/pendapatan/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/pendapatan`, {params})
  },  
  fetchById(id){
    return axios.get(`/pendapatan/${id}`)
  },
  create(payload){
    return axios.post(`/pendapatan`, payload)
  },
  update(id, payload){
    return axios.post(`/pendapatan/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/pendapatan/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/pendapatan`, payload)
  },
}