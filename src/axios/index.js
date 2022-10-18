import axios from 'axios'
import store from '@/store'

/* CREATE AXIOS GLOBAL INSTANCE */
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:3000/api/v1"
})

/* ADD INTERCEPTORS REQUEST */
instance.interceptors.request.use(function (config){
  const token = store.getters.token
  if (token) {
    config.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  return config
}, function(error){
  return Promise.reject(error)
})

/* ADD INTERCEPTORS RESPONSE */
instance.interceptors.response.use(undefined, function (error) {
  if (error) {
    const originalRequest = error.config
    if ((error.response.status === 401 && !originalRequest._retry) || error.response.status === 403) {
        originalRequest._retry = true

        /* REMOVE DATA TO LOCAL STORAGE */
        localStorage.setItem('accessToken', null)

        store.dispatch('setAuthentication', null)
        store.dispatch('setUser', null)

        window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  }
})

export default instance