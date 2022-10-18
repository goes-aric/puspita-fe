import axios from '@/axios'

export default {
  register(payload){
    return axios.post(`/auth/register`, payload)
  },
  login(payload){
    return axios.post(`/auth/login`, payload)
  },
  logout(){
    return axios.get(`/auth/logout`)
  },
  forgotPassword(payload){
    return axios.post(`/users/forgot`, payload)
  },
  resetPasswordByUser(payload){
    return axios.post(`/users/forgot/reset`, payload)
  }  
}