import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/agunan/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/agunan`, {params})
  },  
  fetchById(id){
    return axios.get(`/agunan/${id}`)
  },    
  create(payload){
    return axios.post(`/agunan`, payload)
  },
  update(id, payload){
    return axios.post(`/agunan/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/agunan/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/agunan`, payload)
  } 
}