const state = {
  isHidden: true,
  prevActive: 'dashboard',
  currActive: 'dashboard'
}

const getters = {
  isHidden: state => state.isHidden,
  prevActive: state => state.prevActive,
  currActive: state => state.currActive
}

const actions = {
  async toggleSidebar({commit}, isHidden){
    commit('setSidebarVisible', isHidden)
  },
  async togglePrevActive({commit}, prevActive){
    commit('setPrevActive', prevActive)
  },
  async toggleCurrActive({commit}, currActive){
    commit('setCurrActive', currActive)
  }  
}

const mutations = {
  setSidebarVisible(state, isHidden) {
    state.isHidden = isHidden
  },
  setPrevActive(state, prevActive) {
    state.prevActive = prevActive
  },
  setCurrActive(state, currActive) {
    state.currActive = currActive
  }    
}

export default {
  state,
  getters,
  actions,
  mutations  
}