import Vue from 'vue'
import Vuex from 'vuex'
import App from 'Components/App'
import store from 'Store'

new Vue({
    el: '#vue-app',
    store,
    render: h => h(App)
})
