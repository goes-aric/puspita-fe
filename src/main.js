import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMultiselect from 'vue-multiselect'
import VueSweetalert2 from 'vue-sweetalert2'
import Toast from "vue-toastification"
import { defineRule, configure } from 'vee-validate'
import AllRules from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import id from '@vee-validate/i18n/dist/locale/id.json'
import VCalendar from 'v-calendar'
import VueProgressBar from "@aacassandra/vue3-progressbar"
import Number from '@coders-tm/vue-number-format'
import print from 'vue3-print-nb'
import './assets/css/app.css'
import './assets/css/custom.css'
import 'vue-multiselect/dist/vue-multiselect.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import "vue-toastification/dist/index.css"
import 'v-calendar/dist/style.css'

// Make the validat aggressive to show case validators
configure({
  validateOnInput: true,
  generateMessage: localize("id", id),
})

// Install all rules
Object.keys(AllRules).forEach(rule => {
  defineRule(rule, AllRules[rule]);
})

/* Vue Progress Bar Options */
const options = {
  color: 'rgb(124, 58, 237)',
  failedColor: 'rgb(219, 39, 119)',
  thickness: '5px',
  transition: {
    speed: '0.5s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

const app = createApp(App)
app.component('VueMultiselect', VueMultiselect)
app.use(store)
app.use(router)
app.use(VueSweetalert2)
app.use(Toast)
app.use(VCalendar, {})
app.use(VueProgressBar, options)
app.use(Number, { precision: 4 })
app.use(print)

app.mount('#app')