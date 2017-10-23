'use strict';

import Vue from 'vue'
import Vuex from 'vuex'
import LeftToolbar from 'Conf/LeftToolbar'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        needsRefresh: false,
        leftToolbarSelected: LeftToolbar.Drag,
        // When we are drawing something, we should temporary ban the button.
        buttonBanned: false,
    },
    mutations: {
        emitRefresh: state => state.needsRefresh = !state.needsRefresh,
        setLeftToolbarSelected: (state, x) => state.leftToolbarSelected = x,
        banButton: (state, x) => state.buttonBanned = x
    },
    getters: {
        needsRefresh: state => state.needsRefresh,
        leftToolbarSelected: state => state.leftToolbarSelected
    }
})
