<template>
<canvas id="main-canvas"></canvas>
</template>

<script>
import * as Three from 'three';
import Store from 'Store';
import Renderer from 'Core/Renderer';
import resize from 'vue-resize-directive';

export default {
    name: 'main-canvas',
    data: () => ({
        needsRefresh: Store.needsRefresh,
        renderer: null
    }),
    watch: {
        needsRefresh: function() {
            if (this.renderer)
                this.renderer.render();
        }
    },
    mounted: function() {
        this.renderer = new Renderer(this.$el, this.$el.clientWidth, this.$el.clientHeight);
        var that = this;
        window.addEventListener('resize', () =>
        {
            that.renderer.onSizeChanged(window.innerWidth, window.innerHeight);
        });
        this.needsRefresh = true;
    }
}
</script>

<style>
#main-canvas {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
