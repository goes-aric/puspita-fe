import store from '@/store'

export default {
  checkMenu(props) {  
    const result = store.getters.userMenus.includes(props)
    return result
  },
  checkPermission(props) {  
    const result = store.getters.userPermissions.includes(props)
    return result
  }
}