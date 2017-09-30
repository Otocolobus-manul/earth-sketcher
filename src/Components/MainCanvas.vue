<template>
<canvas id="main-canvas" v-on="{ mousedown: onMouseDown, mousemove: onMouseMove, mouseup: onMouseUp, keydown: onKeyDown, keyup: onKeyUp }"></canvas>
</template>

<script>
import * as Three from 'three';
import {mapGetters} from 'vuex';
import Renderer from 'Core/Renderer';
import LeftToolbarConf from 'Conf/LeftToolbar';

export default {
    name: 'main-canvas',

    data: () => ({
        renderer: null,
        keyPressed: new Set(),
        operationHandler: [
            {
                signal: LeftToolbarConf.Grab,
                keyboardFilter: [32],  // space
                onMouseMove: () => {
                    this.renderer.applyLookatMove(this.lastX, this.lastY, this.nowX, this.nowY);
                }
            },
            {
                signal: LeftToolbarConf.Grab,
                onMouseMove: () => {
                    this.renderer.applyCameraMove(this.lastX, this.lastY, this.nowX, this.nowY);
                }
            }
        ],
        currentOperation: null,
        originX: 0, originY: 0, lastX: 0, lastY: 0, nowX: 0, nowY: 0
    }),

    created: function() {
        this.currentOperation = this.operationHandler[1];
    },

    computed: {
        ...mapGetters(['needsRefresh', 'leftToolbarSelected'])
    },

    watch: {
        needsRefresh: function() {
            if (this.renderer)
                this.renderer.render();
        },
        leftToolbarSelected: function() {
            determineCurrentOperation();
        }
    },

    mounted: function() {
        this.renderer = new Renderer(this.$el, this.$el.clientWidth, this.$el.clientHeight);
        window.addEventListener('resize', () => {
            this.renderer.applySizeChange(window.innerWidth, window.innerHeight);
        });
        this.$store.commit('emitRefresh');
        this.needsRefresh = true;
    },

    methods: {
        determineCurrentOperation() {
            for (i of this.operationHandler) {
                if (i.signal == this.leftToolbarSelected && (
                    !i.keyboardFilter || i.keyboardFilter.every(e => this.keyPressed.has(e)))) {
                    this.currentOperation = i;
                    break;
                }
            }
        },

        onKeyDown: function(e) {
            keyPressed.add(e.keyCode);
            determineCurrentOperation();
        },

        onKeyUp: function(e) {
            keyPressed.delete(e.keyCode);
            determineCurrentOperation();
        },

        onMouseDown: function(e) {
            this.$store.commit('banButton', true);
            this.originX = this.lastX = this.nowX = e.clientX;
            this.originY = this.lastY = this.nowY = e.clientY;
            if (this.renderer && this.currentOperation.onMouseDown)
                this.currentOperation.onMouseDown();
        },

        onMouseMove: function(e) {
            this.lastX = this.nowX;
            this.lastY = this.nowY;
            this.nowX = e.clientX;
            this.nowY = e.clientY;
            if (this.renderer && this.currentOperation.onMouseMove)
                this.currentOperation.onMouseMove();
        },

        onMouseUp: function(e) {
            if (this.renderer && this.currentOperation.onMouseDown)
                this.currentOperation.onMouseDown();
            this.$store.commit('banButton', false);
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
