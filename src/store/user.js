const state = {
  newUserID: null,
  indexUserRoute: null,
  userMenus: [],
  userPermissions: [],
};

const getters = {
  newUserID: state => state.newUserID,
  indexUserRoute: state => state.indexUserRoute,
  userMenus: state => state.userMenus,
  userPermissions: state => state.userPermissions
};

const actions = {
  setNewUserID({commit}, newUserID){
    commit('setNewUserID', newUserID)
  },
  setIndexUserRoute({commit}, fullPath){
    commit('setIndexUserRoute', fullPath)
  },
  setUserMenus({commit}, userMenus){
    commit('setUserMenus', userMenus)
  },
  setUserPermissions({commit}, userPermissions){
    commit('setUserPermissions', userPermissions)
  }  
};

const mutations = {
  setNewUserID(state, newUserID){
    state.newUserID = newUserID
  },
  setIndexUserRoute(state, fullPath){
    state.indexUserRoute = fullPath
  },
  setUserMenus(state, userMenus){
    state.userMenus = userMenus
  },
  setUserPermissions(state, userPermissions){
    state.userPermissions = userPermissions
  }  
};

export default {
  state,
  getters,
  actions,
  mutations
};