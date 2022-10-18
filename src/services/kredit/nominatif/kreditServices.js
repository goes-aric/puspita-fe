import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/kredit/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/kredit`, {params})
  },
  fetchById(id){
    return axios.get(`/kredit/${id}`)
  },
  create(payload){
    return axios.post(`/kredit`, payload)
  },
  update(id, payload){
    return axios.put(`/kredit/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/kredit/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/kredit`, payload)
  },
  fetchDataOptions(params){
    return axios.get(`/kredit/options`, {params})
  },
  export(payload){
    return axios.post(`/kredit/export`, payload)
  },
  fetchStatusOptions(){
    return axios.get(`/kredit/status-list`)
  },
  fetchSistemBungaOptions(){
    return axios.get(`/kredit/sistem-bunga`)
  },    
}