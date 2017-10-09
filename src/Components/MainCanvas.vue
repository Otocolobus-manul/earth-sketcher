<template>
<canvas id="main-canvas" v-on="{ mousedown: onMouseDown, mousemove: onMouseMove, mouseup: onMouseUp }"></canvas>
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
        mouseDown: false,
        operationHandler: [
            {
                signal: LeftToolbarConf.Grab,
                keyboardFilter: [32],  // space
                onMouseMove: function() {
                    this.renderer.applyLookatMove(this.lastX, this.lastY, this.nowX, this.nowY);
                }
            },
            {
                signal: LeftToolbarConf.Grab,
                onMouseMove: function() {
                    this.renderer.applyCameraMove(this.lastX, this.lastY, this.nowX, this.nowY);
                }
            }
        ],
        currentOperation: null,
        originX: 0, originY: 0, lastX: 0, lastY: 0, nowX: 0, nowY: 0
    }),

    created: function() {
        this.currentOperation = this.operationHandler[1];
        window.onkeydown = (function(e) {
            this.keyPressed.add(e.keyCode);
            this.determineCurrentOperation();
        }).bind(this);
        window.onkeyup = (function(e) {
            this.keyPressed.delete(e.keyCode);
            this.determineCurrentOperation();
        }).bind(this);
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
            this.determineCurrentOperation();
        }
    },

    mounted: function() {
        this.renderer = new Renderer(this.$el, this.$el.clientWidth, this.$el.clientHeight);
        window.addEventListener('resize', () => {
            this.renderer.applySizeChange(window.innerWidth, window.innerHeight);
        });
        this.$store.commit('emitRefresh');
    },

    methods: {
        determineCurrentOperation() {
            for (var i of this.operationHandler) {
                if (i.signal == this.leftToolbarSelected && (
                    !i.keyboardFilter || i.keyboardFilter.every(e => this.keyPressed.has(e)))) {
                    this.currentOperation = i;
                    return;
                }
            }
            this.currentOperation = null;
        },

        onMouseDown: function(e) {
            this.$store.commit('banButton', true);
            this.originX = this.lastX = this.nowX = e.clientX;
            this.originY = this.lastY = this.nowY = e.clientY;
            this.mouseDown = true;
            if (this.renderer && this.currentOperation && this.currentOperation.onMouseDown)
                this.currentOperation.onMouseDown.call(this);
        },

        onMouseMove: function(e) {
            if (this.mouseDown && this.currentOperation) {
                this.lastX = this.nowX;
                this.lastY = this.nowY;
                this.nowX = e.clientX;
                this.nowY = e.clientY;
                if (this.renderer && this.currentOperation.onMouseMove)
                    this.currentOperation.onMouseMove.call(this);
            }
        },

        onMouseUp: function(e) {
            this.mouseDown = false;
            if (this.renderer && this.currentOperation && this.currentOperation.onMouseDown)
                this.currentOperation.onMouseDown.call(this);
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
