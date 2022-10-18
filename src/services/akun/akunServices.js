import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/akun/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/akun`, {params})
  },  
  fetchById(id){
    return axios.get(`/akun/${id}`)
  },
  create(payload){
    return axios.post(`/akun`, payload)
  },
  update(id, payload){
    return axios.put(`/akun/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/akun/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/akun`, payload)
  },
  fetchDataOptions(params){
    return axios.get(`/akun/options`, {params})
  },
}