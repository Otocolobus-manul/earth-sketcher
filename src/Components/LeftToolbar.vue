<template>
<div id="left-toolbar">
    <div class="toolbar-top">
        <div class="hidden-show-button"><i class="material-icons">chevron_left</i></div>
    </div>
    <toolbar-button :event="Conf.Grab" :button-text="Conf.Grab.Description"></toolbar-button>
    <toolbar-button :event="Conf.Select" :button-text="Conf.Select.Description"></toolbar-button>
</div>
</template>

<script>
import Conf from 'Conf/LeftToolbar';
import ToolbarButton from './ToolbarButton.vue'

export default {
    name: 'left-toolbar',
    data: () => ({Conf: Conf}),
    components: { ToolbarButton }
}
</script>

<style scoped>
#left-toolbar {
    position: absolute;
    left: 0px;
    top: 100px;
    padding: 8px;
    padding-left: 13px;
    border-radius: 5px;
    background-color: rgba(116, 137, 156, 0.7);
    margin-left: -5px;
}

.toolbar-top {
    height: 24px;
}

.hidden-show-button {
    width: 24px;
    height: 24px;
    float: right;
    color: white;
}
</style>
