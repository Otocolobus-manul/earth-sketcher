<template>
<canvas id="main-canvas" @mousedown="on('mouseDown', $event)" @mousemove="on('mouseMove', $event)"  @mouseup="on('mouseUp', $event)"></canvas>
</template>

<script>
import {mapGetters} from 'vuex';
import Renderer from 'Core/Renderer';
import LeftToolbarConf from 'Conf/LeftToolbar';
import RegisterAll from 'Controller/RegisterAll';

export default {
    name: 'main-canvas',

    data: () => ({
        renderer: null,
        eventHandler: null
    }),

    computed: {
        ...mapGetters(['needsRefresh', 'leftToolbarSelected'])
    },

    watch: {
        needsRefresh: function() {
            if (this.renderer)
                this.renderer.render();
        },
        leftToolbarSelected: function(v) {
            this.eventHandler.signalEmit(v);
        }
    },

    mounted: function() {
        this.renderer = new Renderer(this.$el, this.$el.clientWidth, this.$el.clientHeight);
        this.eventHandler = RegisterAll(this, this.renderer);
        window.addEventListener('resize', () => {
            this.renderer.applySizeChange(window.innerWidth, window.innerHeight);
        });
        require('mouse-wheel')(window, (dx, dy, dz, e) => this.on('wheel', [dx, dy, dz, e]), true);
        this.$store.commit('emitRefresh');
    },

    methods: {
        on(type, e) {
            if (this.eventHandler)
                this.eventHandler.on(type, e);
        }
    }
}
</script>

<style scoped>
#main-canvas {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
