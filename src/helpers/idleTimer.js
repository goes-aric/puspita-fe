import store from '@/store'

class IdleTimer {
  constructor ({ timeout, onTimeOut }) {
    this.timeout = timeout
    this.onTimeOut = onTimeOut
    
    // const expiredTime = parseInt(localStorage.getItem("_expiredTime") || 0, 10)
    // if (expiredTime > 0 && expiredTime < Date.now()) {
    //   onExpired()
    //   return
    // }

    this.eventHandler = this.updateExpiredTime.bind(this)
    this.tracker()
    this.startInterval()
  }

  startInterval() {
    this.updateExpiredTime()

    this.interval = setInterval(() => {
      const expiredTime = parseInt(localStorage.getItem("_expiredTime") || 0, 10)
      if (expiredTime < Date.now()) {
        if (this.onTimeOut) {
          this.onTimeOut()
          this.cleanUp()
        }
      }
    }, 1000)
  }

  updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker)
    }
    this.timeoutTracker = setTimeout(() => {
      localStorage.setItem("_expiredTime", Date.now() + this.timeout * 1000)
    }, 300)
  }

  tracker() {
    window.addEventListener("mousemove", this.eventHandler)
    window.addEventListener("scroll", this.eventHandler)
    window.addEventListener("keydown", this.eventHandler)
  }

  cleanUp() {
    localStorage.removeItem("_expiredTime")
    clearInterval(this.interval)
    window.removeEventListener("mousemove", this.eventHandler)
    window.removeEventListener("scroll", this.eventHandler)
    window.removeEventListener("keydown", this.eventHandler)

    /* REMOVE DATA TO LOCAL STORAGE */
    localStorage.setItem('accessToken', null)

    store.dispatch('setAuthentication', null)
    store.dispatch('setUser', null)

    window.location.href = "/auth/login"
  }
}

export default IdleTimer