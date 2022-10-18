import axios from '@/axios'

export default {
  fetchLimit(params){
    return axios.get(`/users`, {params})
  },  
  fetchById(id){
    return axios.get(`/users/${id}`)
  },    
  create(payload){
    return axios.post(`/users`, payload)
  },
  update(id, payload){
    return axios.put(`/users/${id}`, payload)
  },
  updateProfile(payload){
    return axios.put(`/users/profile`, payload)
  },   
  updatePassword(payload){
    return axios.put(`/users/password`, payload)
  }, 
  resetPassword(id){
    return axios.put(`/users/password/${id}`)
  },    
  delete(id){
    return axios.delete(`/users/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/users`, payload)
  },
  fetchDataOptions(params){
    return axios.get(`/users/options`, {params})
  }  
}