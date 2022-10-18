import axios from '@/axios'

export default {
  fetchAll(params){
    return axios.get(`/produk-kredit/all`, {params})
  },
  fetchLimit(params){
    return axios.get(`/produk-kredit`, {params})
  },  
  fetchById(id){
    return axios.get(`/produk-kredit/${id}`)
  },
  fetchByField(payload){
    return axios.post(`/produk-kredit/field`, payload)
  },  
  create(payload){
    return axios.post(`/produk-kredit`, payload)
  },
  update(id, payload){
    return axios.put(`/produk-kredit/${id}`, payload)
  },
  delete(id){
    return axios.delete(`/produk-kredit/${id}`)
  }, 
  deleteMultiple(payload){
    return axios.delete(`/produk-kredit`, payload)
  },
  fetchDataOptions(params){
    return axios.get(`/produk-kredit/options`, {params})
  }  
}