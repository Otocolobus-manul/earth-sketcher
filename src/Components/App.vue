<template>
<div id="main">
    <main-canvas></main-canvas>
    <left-toolbar></left-toolbar>
</div>
</template>

<script>
import MainCanvas from './MainCanvas'
import LeftToolbar from './LeftToolbar'
export default {
    name: 'main',
    components: {
        MainCanvas,
        LeftToolbar
    }
}
</script>

<style scoped>
#main {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
