import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/kendaraan/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/kendaraan`, {params})
  },  
  fetchById(id){
    return axios.get(`/kendaraan/${id}`)
  },
  create(payload){
    return axios.post(`/kendaraan`, payload)
  },
  update(id, payload){
    return axios.put(`/kendaraan/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/kendaraan/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/kendaraan`, payload)
  },
  fetchDataOptions(params){
    return axios.get(`/kendaraan/options`, {params})
  },
}