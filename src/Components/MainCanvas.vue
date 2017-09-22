<template>
    <canvas id="main"></canvas>
</template>

<script>
import * as Three from 'three';
import Store from 'Store';
import Renderer from 'Core/Renderer';

export default {
    name: 'main',
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
        this.needsRefresh = true;
    }
}
</script>

