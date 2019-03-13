import Vue from 'vue'
import Element from 'element-ui'
import Icon from 'vue-svg-icon/Icon.vue'

import '@/theme/element-#41B883/index.css'
import '@/assets/styl/index'
import App from '@/App'
import { router } from '@/router'
import '@/router/routerControl'
import store from '@/store'
import i18n from '@/lang'

require('./mock/index.js')

Vue.config.productionTip = true
Vue.component('icon', Icon)

Vue.use(Element, {
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
