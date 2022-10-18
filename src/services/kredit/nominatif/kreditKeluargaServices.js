import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/keluarga/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/keluarga`, {params})
  },  
  fetchById(id){
    return axios.get(`/keluarga/${id}`)
  },    
  create(payload){
    return axios.post(`/keluarga`, payload)
  },
  update(id, payload){
    return axios.put(`/keluarga/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/keluarga/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/keluarga`, payload)
  } 
}