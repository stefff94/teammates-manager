import Vue from 'vue'
import App from './App.vue'

import jQuery from 'jquery'
import $ from 'jquery'

global.jQuery = jQuery
global.$ = $

require('fomantic-ui/dist/semantic.min.css')
require('fomantic-ui/dist/semantic.min.js')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
