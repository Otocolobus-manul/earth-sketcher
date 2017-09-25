<template>
<div id="main">
    <main-canvas></main-canvas>
</div>
</template>

<script>
import MainCanvas from './MainCanvas'
export default {
    name: 'main',
    components: {
        MainCanvas
    }
}
</script>

<style>
#main {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
