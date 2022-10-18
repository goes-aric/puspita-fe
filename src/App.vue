<template>
  <div v-if="$route.path.indexOf('auth') === -1">
    <Wrapper>
      <Topbar />
      <Container>
        <Sidebar />
        <Content>
          <router-view></router-view>
        </Content>
      </Container>
    </Wrapper>  
  </div>
  <div v-if="$route.path.indexOf('auth') > -1">
    <router-view></router-view>
  </div>
  <!-- set progressbar -->
  <vue-progress-bar></vue-progress-bar>     
</template>

<script>
import Wrapper from './components/layout/contents/Wrapper.vue'
import Container from './components/layout/contents/Container.vue'
import Content from './components/layout/contents/Content.vue'
import Topbar from './components/layout/navbar/Topbar.vue'
import Sidebar from './components/layout/sidebar/Sidebar.vue'
import IdleTimer from './helpers/idleTimer'

export default {
  name: 'App',
  components: {
    Wrapper,
    Topbar,
    Container,
    Sidebar,
    Content
  },
  data() {
    return {
      isTimeOut: false
    }
  },
  created() {
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start()
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        // parse meta tags
        this.$Progress.parseMeta(meta)
      }
      //  start the progress bar
      this.$Progress.start()
      //  continue to next page
      next()
    })
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach(() => {
      //  finish the progress bar
      this.$Progress.finish()
    })

    const timer = new IdleTimer({
      timeout: import.meta.env.VITE_APP_TIMEOUT || 900,
      onTimeOut: () => {
        this.isTimeOut = true
      }
    })

    return () => {
      timer.cleanUp()
    }
  },
  mounted () {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish()
  },
}
</script>